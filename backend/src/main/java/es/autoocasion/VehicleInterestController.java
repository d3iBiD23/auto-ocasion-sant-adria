package es.autoocasion;

import java.util.List;
import java.time.LocalDateTime;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/vehicle-interests")
@CrossOrigin(originPatterns = "*")
public class VehicleInterestController {
  private final VehicleInterestRepository repository;
  private final VehicleRepository vehicles;
  private final AdminSessions sessions;

  VehicleInterestController(VehicleInterestRepository repository, VehicleRepository vehicles, AdminSessions sessions) {
    this.repository = repository;
    this.vehicles = vehicles;
    this.sessions = sessions;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public VehicleInterest create(@RequestBody VehicleInterest input) {
    if (input.vehicleId == null || blank(input.name) || blank(input.phone)) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Indica tu nombre y teléfono.");
    }
    if (!Boolean.TRUE.equals(input.consent)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debes aceptar la política de privacidad.");
    String normalizedPhone = input.phone.replaceAll("\\D", "");
    repository.findTopByPhoneAndVehicleIdOrderByCreatedAtDesc(normalizedPhone, input.vehicleId)
        .filter(previous -> previous.createdAt.isAfter(LocalDateTime.now().minusHours(24)))
        .ifPresent(previous -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una solicitud reciente para este vehículo."); });
    Vehicle vehicle = vehicles.findById(input.vehicleId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    VehicleInterest interest = new VehicleInterest();
    interest.vehicleId = vehicle.id;
    interest.vehicleName = vehicle.brand + " " + vehicle.model;
    interest.vehiclePrice = vehicle.price;
    interest.name = input.name.trim(); interest.phone = normalizedPhone;
    interest.email = blank(input.email) ? null : input.email.trim();
    interest.message = blank(input.message) ? null : input.message.trim();
    interest.source = "Anuncio: " + interest.vehicleName;
    interest.sourceDevice = input.sourceDevice;
    interest.consentAt = LocalDateTime.now();
    interest.priority = blank(interest.message) ? "NORMAL" : "HIGH";
    return repository.save(interest);
  }

  @GetMapping
  public List<VehicleInterest> all(@RequestParam(defaultValue = "false") boolean deleted, @RequestHeader(value = "Authorization", required = false) String token) {
    guard(token); List<VehicleInterest> leads = deleted ? repository.findAllByDeletedAtIsNotNullOrderByDeletedAtDesc() : repository.findAllByDeletedAtIsNullOrderByCreatedAtDesc(); leads.forEach(this::normalize); return leads;
  }

  @PatchMapping("/{id}/read")
  public VehicleInterest toggleRead(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String token) {
    guard(token);
    VehicleInterest interest = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    interest.read = !interest.read;
    interest.status = interest.read ? "CONTACTED" : "NEW";
    interest.updatedAt = LocalDateTime.now();
    return repository.save(interest);
  }

  @PatchMapping("/{id}")
  public VehicleInterest update(@PathVariable Long id, @RequestBody LeadUpdate input, @RequestHeader(value = "Authorization", required = false) String token) {
    guard(token);
    VehicleInterest interest = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    if (input.status != null) interest.status = input.status;
    if (input.priority != null) interest.priority = input.priority;
    if (input.adminNote != null) interest.adminNote = blank(input.adminNote) ? null : input.adminNote.trim();
    interest.nextActionAt = input.nextActionAt;
    interest.nextActionText = blank(input.nextActionText) ? null : input.nextActionText.trim();
    interest.appointmentAt = input.appointmentAt;
    interest.appointmentNote = blank(input.appointmentNote) ? null : input.appointmentNote.trim();
    normalize(interest); interest.updatedAt = LocalDateTime.now();
    return repository.save(interest);
  }

  @DeleteMapping("/{id}/anonymize")
  public VehicleInterest anonymize(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String token) {
    guard(token); VehicleInterest interest = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    interest.name = "Contacto anonimizado"; interest.phone = ""; interest.email = null; interest.message = null; interest.adminNote = null; interest.nextActionText = null; interest.appointmentNote = null; interest.status = "CLOSED"; interest.updatedAt = LocalDateTime.now();
    return repository.save(interest);
  }
  @DeleteMapping("/{id}")
  public VehicleInterest moveToTrash(@PathVariable Long id, @RequestHeader(value="Authorization",required=false) String token) {
    guard(token); VehicleInterest interest = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    interest.deletedAt = LocalDateTime.now(); interest.updatedAt = interest.deletedAt;
    return repository.save(interest);
  }
  @PatchMapping("/{id}/restore")
  public VehicleInterest restore(@PathVariable Long id, @RequestHeader(value="Authorization",required=false) String token) {
    guard(token); VehicleInterest interest = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    interest.deletedAt = null; interest.updatedAt = LocalDateTime.now();
    return repository.save(interest);
  }
  @DeleteMapping("/{id}/permanently")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void permanentlyDelete(@PathVariable Long id, @RequestHeader(value="Authorization",required=false) String token) {
    guard(token); VehicleInterest interest = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    if (interest.deletedAt == null) throw new ResponseStatusException(HttpStatus.CONFLICT, "Primero mueve la solicitud a la papelera.");
    repository.delete(interest);
  }
  private void normalize(VehicleInterest interest) { if (interest.status == null || !List.of("NEW", "CONTACTED", "NEGOTIATING", "APPOINTMENT", "CLOSED").contains(interest.status)) interest.status = interest.read ? "CONTACTED" : "NEW"; if (interest.priority == null || !List.of("NORMAL", "HIGH").contains(interest.priority)) interest.priority = "NORMAL"; interest.read = !"NEW".equals(interest.status); }
  static class LeadUpdate { public String status; public String priority; public String adminNote; public LocalDateTime nextActionAt; public String nextActionText; public LocalDateTime appointmentAt; public String appointmentNote; }

  private boolean blank(String value) { return value == null || value.isBlank(); }
  private void guard(String token) { if (!sessions.valid(token)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED); }
}

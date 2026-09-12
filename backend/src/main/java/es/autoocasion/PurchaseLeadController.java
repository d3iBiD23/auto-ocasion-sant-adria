package es.autoocasion;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/sell-requests")
@CrossOrigin(originPatterns = "*")
public class PurchaseLeadController {
  private final PurchaseLeadRepository repository;
  private final AdminSessions sessions;
  private final ImageStorage images;

  PurchaseLeadController(PurchaseLeadRepository repository, AdminSessions sessions, ImageStorage images) {
    this.repository = repository;
    this.sessions = sessions;
    this.images = images;
  }

  @PostMapping(consumes = "multipart/form-data")
  @ResponseStatus(HttpStatus.CREATED)
  public PurchaseLead create(
      @RequestParam String name,
      @RequestParam String phone,
      @RequestParam(required = false) String email,
      @RequestParam String brand,
      @RequestParam String model,
      @RequestParam String version,
      @RequestParam(required = false) String registration,
      @RequestParam(required = false) Integer year,
      @RequestParam(required = false) Integer kilometers,
      @RequestParam(required = false) String fuel,
      @RequestParam(required = false) String transmission,
      @RequestParam(required = false) String condition,
      @RequestParam(required = false) Integer expectedPrice,
      @RequestParam String description,
      @RequestParam boolean consent,
      @RequestParam(required = false) String sourceDevice,
      @RequestParam(required = false, name = "photos") List<MultipartFile> photos) throws IOException {
    if (name.isBlank() || phone.isBlank() || brand.isBlank() || model.isBlank() || version.isBlank() || description.isBlank()
        || year == null || kilometers == null || fuel == null || fuel.isBlank() || transmission == null || transmission.isBlank()
        || condition == null || condition.isBlank()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Completa los datos obligatorios.");
    }
    if (year < 1950 || year > 2035 || kilometers < 0) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Revisa el año y los kilómetros.");
    }
    if (photos == null || photos.stream().noneMatch(photo -> !photo.isEmpty())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Adjunta al menos una fotografía.");
    }
    if (photos != null && photos.size() > 10) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Puedes subir un máximo de 10 fotografías.");
    }
    if (!consent) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debes aceptar la política de privacidad.");
    String normalizedPhone = phone.replaceAll("\\D", "");
    repository.findTopByPhoneAndBrandAndModelOrderByCreatedAtDesc(normalizedPhone, brand.trim(), model.trim())
        .filter(previous -> previous.createdAt.isAfter(LocalDateTime.now().minusHours(24)))
        .ifPresent(previous -> { throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una solicitud igual de las últimas 24 horas."); });
    PurchaseLead lead = new PurchaseLead();
    lead.name = name.trim(); lead.phone = normalizedPhone; lead.email = blankToNull(email);
    lead.brand = brand.trim(); lead.model = model.trim(); lead.version = version.trim(); lead.registration = blankToNull(registration);
    lead.year = year; lead.kilometers = kilometers; lead.fuel = blankToNull(fuel);
    lead.transmission = blankToNull(transmission); lead.condition = blankToNull(condition);
    lead.expectedPrice = expectedPrice; lead.description = description.trim();
    lead.consentAt = LocalDateTime.now();
    lead.sourceDevice = blankToNull(sourceDevice);
    lead.priority = registration != null && !registration.isBlank() || expectedPrice != null ? "HIGH" : "NORMAL";
    if (photos != null) for (MultipartFile photo : photos) {
      if (photo.isEmpty()) continue;
      lead.images.add(images.store(photo, "compra"));
    }
    if (!lead.images.isEmpty()) lead.priority = "HIGH";
    return repository.save(lead);
  }

  @GetMapping
  public List<PurchaseLead> all(@RequestParam(defaultValue = "false") boolean deleted, @RequestHeader(value = "Authorization", required = false) String token) {
    guard(token); List<PurchaseLead> leads = deleted ? repository.findAllByDeletedAtIsNotNullOrderByDeletedAtDesc() : repository.findAllByDeletedAtIsNullOrderByCreatedAtDesc(); leads.forEach(this::normalize); return leads;
  }

  @PatchMapping("/{id}/read")
  public PurchaseLead toggleRead(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String token) {
    guard(token);
    PurchaseLead lead = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    lead.read = !lead.read;
    lead.status = lead.read ? "CONTACTED" : "NEW";
    lead.updatedAt = LocalDateTime.now();
    return repository.save(lead);
  }

  @PatchMapping("/{id}")
  public PurchaseLead update(@PathVariable Long id, @RequestBody LeadUpdate input, @RequestHeader(value = "Authorization", required = false) String token) {
    guard(token);
    PurchaseLead lead = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    if (input.status != null) lead.status = input.status;
    if (input.priority != null) lead.priority = input.priority;
    if (input.adminNote != null) lead.adminNote = blankToNull(input.adminNote);
    lead.nextActionAt = input.nextActionAt;
    lead.nextActionText = blankToNull(input.nextActionText);
    lead.appointmentAt = input.appointmentAt;
    lead.appointmentNote = blankToNull(input.appointmentNote);
    normalize(lead); lead.updatedAt = LocalDateTime.now();
    return repository.save(lead);
  }

  @DeleteMapping("/{id}/anonymize")
  public PurchaseLead anonymize(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String token) throws IOException {
    guard(token); PurchaseLead lead = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    for (String image : lead.images) images.delete(image);
    lead.images.clear(); lead.name = "Contacto anonimizado"; lead.phone = ""; lead.email = null; lead.registration = null; lead.description = "Datos eliminados por privacidad."; lead.adminNote = null; lead.nextActionText = null; lead.appointmentNote = null; lead.status = "CLOSED"; lead.updatedAt = LocalDateTime.now();
    return repository.save(lead);
  }
  @DeleteMapping("/{id}")
  public PurchaseLead moveToTrash(@PathVariable Long id, @RequestHeader(value="Authorization",required=false) String token) {
    guard(token); PurchaseLead lead = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    lead.deletedAt = LocalDateTime.now(); lead.updatedAt = lead.deletedAt;
    return repository.save(lead);
  }
  @PatchMapping("/{id}/restore")
  public PurchaseLead restore(@PathVariable Long id, @RequestHeader(value="Authorization",required=false) String token) {
    guard(token); PurchaseLead lead = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    lead.deletedAt = null; lead.updatedAt = LocalDateTime.now();
    return repository.save(lead);
  }
  @DeleteMapping("/{id}/permanently")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void permanentlyDelete(@PathVariable Long id, @RequestHeader(value="Authorization",required=false) String token) throws IOException {
    guard(token); PurchaseLead lead = repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    if (lead.deletedAt == null) throw new ResponseStatusException(HttpStatus.CONFLICT, "Primero mueve la solicitud a la papelera.");
    for (String image : lead.images) images.delete(image);
    repository.delete(lead);
  }
  private void normalize(PurchaseLead lead) { if (lead.status == null || !List.of("NEW", "CONTACTED", "NEGOTIATING", "APPOINTMENT", "CLOSED").contains(lead.status)) lead.status = lead.read ? "CONTACTED" : "NEW"; if (lead.priority == null || !List.of("NORMAL", "HIGH").contains(lead.priority)) lead.priority = "NORMAL"; lead.read = !"NEW".equals(lead.status); }
  static class LeadUpdate { public String status; public String priority; public String adminNote; public LocalDateTime nextActionAt; public String nextActionText; public LocalDateTime appointmentAt; public String appointmentNote; }

  private String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
  private void guard(String token) { if (!sessions.valid(token)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED); }
}

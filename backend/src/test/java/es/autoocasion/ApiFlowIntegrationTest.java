package es.autoocasion;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Comparator;
import java.util.Map;
import javax.imageio.ImageIO;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

/** Exercises public requests and protected inventory actions against an isolated H2 database. */
@SpringBootTest
@AutoConfigureMockMvc
class ApiFlowIntegrationTest {
  private static final Path TEST_UPLOADS = Path.of("target", "test-uploads");

  @Autowired MockMvc mvc;
  @Autowired ObjectMapper json;
  @Autowired VehicleRepository vehicles;
  @Autowired VehicleInterestRepository interests;
  @Autowired PurchaseLeadRepository purchaseLeads;

  @BeforeEach
  void cleanDatabase() throws IOException {
    interests.deleteAll();
    purchaseLeads.deleteAll();
    vehicles.deleteAll();
    deleteUploads();
  }

  @AfterEach
  void cleanUploads() throws IOException { deleteUploads(); }

  @Test
  void authenticationRejectsInvalidCredentialsAndIssuesSessionForValidCredentials() throws Exception {
    mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"wrong@example.com\",\"password\":\"wrong\"}"))
        .andExpect(status().isUnauthorized());

    mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"test-admin@autoocasion.local\",\"password\":\"TestPassword!123\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.token").isNotEmpty())
        .andExpect(jsonPath("$.name").value("Administración"));
  }

  @Test
  void protectedVehicleStatusRequiresSessionAndCanMarkVehicleReservedAndSold() throws Exception {
    Vehicle vehicle = vehicles.save(vehicle());
    mvc.perform(patch("/api/vehicles/{id}/status", vehicle.id)
        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"RESERVED\"}"))
        .andExpect(status().isUnauthorized());

    String token = login();
    mvc.perform(patch("/api/vehicles/{id}/status", vehicle.id)
        .header("Authorization", "Bearer " + token).contentType(MediaType.APPLICATION_JSON)
        .content("{\"status\":\"RESERVED\"}"))
        .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("RESERVED"))
        .andExpect(jsonPath("$.sold").value(false));
    mvc.perform(patch("/api/vehicles/{id}/sold", vehicle.id).header("Authorization", "Bearer " + token))
        .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("SOLD"))
        .andExpect(jsonPath("$.sold").value(true));
  }

  @Test
  void vehicleInterestNormalizesPhoneAndRejectsRecentDuplicate() throws Exception {
    Vehicle vehicle = vehicles.save(vehicle());
    String body = "{\"vehicleId\":" + vehicle.id + ",\"name\":\" Marta \",\"phone\":\"+34 600 11 22 33\",\"consent\":true}";
    mvc.perform(post("/api/vehicle-interests").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isCreated()).andExpect(jsonPath("$.phone").value("34600112233"));
    mvc.perform(post("/api/vehicle-interests").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isConflict());
    assertThat(interests.count()).isEqualTo(1);
  }

  @Test
  void purchaseRequestCreatesOptimizedPhotoAndRejectsRecentDuplicate() throws Exception {
    MockMultipartFile photo = new MockMultipartFile("photos", "coche.png", "image/png", validPng());
    var request = multipart("/api/sell-requests").file(photo)
        .param("name", "Marta") .param("phone", "600 11 22 33")
        .param("brand", "SEAT").param("model", "Ibiza").param("version", "1.0 TSI")
        .param("year", "2020").param("kilometers", "35000").param("fuel", "Gasolina")
        .param("transmission", "Manual").param("condition", "Excelente")
        .param("description", "Mantenimiento al día").param("consent", "true");
    mvc.perform(request).andExpect(status().isCreated())
        .andExpect(jsonPath("$.phone").value("600112233"))
        .andExpect(jsonPath("$.images.length()").value(1));
    assertThat(fileCount(TEST_UPLOADS)).isEqualTo(1);
    assertThat(fileCount(TEST_UPLOADS.resolve("thumbs"))).isEqualTo(1);

    MockMultipartFile duplicatePhoto = new MockMultipartFile("photos", "coche.png", "image/png", validPng());
    mvc.perform(multipart("/api/sell-requests").file(duplicatePhoto)
        .param("name", "Marta").param("phone", "600112233").param("brand", "SEAT").param("model", "Ibiza")
        .param("version", "1.0 TSI").param("year", "2020").param("kilometers", "35000").param("fuel", "Gasolina")
        .param("transmission", "Manual").param("condition", "Excelente").param("description", "Mantenimiento al día").param("consent", "true"))
        .andExpect(status().isConflict());
    assertThat(purchaseLeads.count()).isEqualTo(1);
  }

  private String login() throws Exception {
    String response = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"test-admin@autoocasion.local\",\"password\":\"TestPassword!123\"}"))
        .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
    return json.readValue(response, new TypeReference<Map<String, String>>() {}).get("token");
  }

  private Vehicle vehicle() {
    Vehicle vehicle = new Vehicle();
    vehicle.brand = "SEAT"; vehicle.model = "Leon"; vehicle.year = 2020; vehicle.kilometers = 50000;
    vehicle.price = 14900; vehicle.fuel = "Gasolina"; vehicle.power = 130; vehicle.transmission = "Manual";
    vehicle.description = "Vehículo de prueba"; vehicle.status = "PUBLISHED";
    return vehicle;
  }

  private byte[] validPng() throws IOException {
    BufferedImage image = new BufferedImage(2, 2, BufferedImage.TYPE_INT_RGB);
    image.setRGB(0, 0, 0xff7849);
    ByteArrayOutputStream output = new ByteArrayOutputStream();
    ImageIO.write(image, "png", output);
    return output.toByteArray();
  }

  private long fileCount(Path directory) throws IOException {
    try (var files = Files.list(directory)) { return files.filter(Files::isRegularFile).count(); }
  }

  private void deleteUploads() throws IOException {
    if (!Files.exists(TEST_UPLOADS)) return;
    try (var paths = Files.walk(TEST_UPLOADS)) {
      paths.sorted(Comparator.reverseOrder()).forEach(path -> {
        try { Files.deleteIfExists(path); } catch (IOException exception) { throw new RuntimeException(exception); }
      });
    }
  }
}

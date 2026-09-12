package es.autoocasion;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class PurchaseLead {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
  public LocalDateTime createdAt = LocalDateTime.now();
  @Column(name = "is_read") public boolean read = false;
  public String status = "NEW";
  public String priority = "NORMAL";
  public String source = "Vende tu coche";
  public String sourceDevice;
  @Column(length = 2000) public String adminNote;
  public LocalDateTime nextActionAt;
  @Column(length = 1000) public String nextActionText;
  public LocalDateTime appointmentAt;
  @Column(length = 1000) public String appointmentNote;
  public LocalDateTime consentAt;
  public LocalDateTime updatedAt = LocalDateTime.now();
  public LocalDateTime deletedAt;
  public String name;
  public String phone;
  public String email;
  public String brand;
  public String model;
  public String version;
  public String registration;
  public Integer year;
  public Integer kilometers;
  public String fuel;
  public String transmission;
  @Column(name = "vehicle_condition") public String condition;
  public Integer expectedPrice;
  @Column(length = 4000) public String description;
  @ElementCollection(fetch = FetchType.EAGER) public List<String> images = new ArrayList<>();
}

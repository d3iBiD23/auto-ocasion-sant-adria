package es.autoocasion;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class VehicleInterest {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
  public LocalDateTime createdAt = LocalDateTime.now();
  @Column(name = "is_read") public boolean read = false;
  public String status = "NEW";
  public String priority = "NORMAL";
  public String source;
  public String sourceDevice;
  @Column(length = 2000) public String adminNote;
  public LocalDateTime nextActionAt;
  @Column(length = 1000) public String nextActionText;
  public LocalDateTime appointmentAt;
  @Column(length = 1000) public String appointmentNote;
  public LocalDateTime consentAt;
  @Transient public Boolean consent;
  public LocalDateTime updatedAt = LocalDateTime.now();
  public LocalDateTime deletedAt;
  public Long vehicleId;
  public String vehicleName;
  public Integer vehiclePrice;
  public String name;
  public String phone;
  public String email;
  @Column(length = 2500) public String message;
}

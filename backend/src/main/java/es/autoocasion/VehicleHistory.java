package es.autoocasion;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class VehicleHistory {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
  @Column(nullable = false) public Long vehicleId;
  @Column(nullable = false) public String type;
  @Column(length = 500) public String detail;
  public LocalDateTime createdAt = LocalDateTime.now();
}

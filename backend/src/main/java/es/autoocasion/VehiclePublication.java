package es.autoocasion;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(uniqueConstraints = @UniqueConstraint(columnNames = {"vehicle_id", "channel"}))
public class VehiclePublication {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  public Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "vehicle_id", nullable = false)
  @JsonIgnore
  public Vehicle vehicle;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  public PublicationChannel channel;

  /** The dealer wants this vehicle to be sent to this portal once connected. */
  public boolean requested = false;

  /** No remote portal is called until an official integration is configured. */
  @Column(nullable = false)
  public String state = "NOT_CONFIGURED";

  public String externalListingId;
  @Column(length = 1000)
  public String externalUrl;
  @Column(length = 2000)
  public String lastError;
  public LocalDateTime updatedAt = LocalDateTime.now();
}

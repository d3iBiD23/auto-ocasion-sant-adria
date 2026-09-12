package es.autoocasion;
import jakarta.persistence.*;import jakarta.validation.constraints.*;import java.time.*;import java.util.*;
@Entity public class Vehicle {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @NotBlank public String brand; @NotBlank public String model; public String version; @NotNull public Integer year; @NotNull public Integer kilometers; @NotNull public Integer price; @NotBlank public String fuel;
 public Integer power; public String transmission; public String highlight; @Column(length=3000) public String description; public boolean sold=false; public String status="PUBLISHED"; public LocalDateTime createdAt=LocalDateTime.now(); public LocalDateTime publishedAt; public LocalDateTime updatedAt=LocalDateTime.now();
 @ElementCollection(fetch=FetchType.EAGER) public List<String> images=new ArrayList<>();
 @OneToMany(mappedBy="vehicle",cascade=CascadeType.ALL,orphanRemoval=true,fetch=FetchType.EAGER) @OrderBy("channel ASC") public List<VehiclePublication> publications=new ArrayList<>();
}

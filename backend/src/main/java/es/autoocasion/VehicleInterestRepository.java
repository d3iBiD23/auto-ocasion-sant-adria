package es.autoocasion;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleInterestRepository extends JpaRepository<VehicleInterest, Long> {
  List<VehicleInterest> findAllByOrderByCreatedAtDesc();
  List<VehicleInterest> findAllByDeletedAtIsNullOrderByCreatedAtDesc();
  List<VehicleInterest> findAllByDeletedAtIsNotNullOrderByDeletedAtDesc();
  Optional<VehicleInterest> findTopByPhoneAndVehicleIdOrderByCreatedAtDesc(String phone, Long vehicleId);
}

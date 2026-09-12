package es.autoocasion;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehiclePublicationRepository extends JpaRepository<VehiclePublication, Long> {
  Optional<VehiclePublication> findByVehicleIdAndChannel(Long vehicleId, PublicationChannel channel);
}

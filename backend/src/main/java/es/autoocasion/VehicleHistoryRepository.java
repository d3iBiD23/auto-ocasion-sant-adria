package es.autoocasion;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleHistoryRepository extends JpaRepository<VehicleHistory, Long> {
  List<VehicleHistory> findTop8ByVehicleIdOrderByCreatedAtDesc(Long vehicleId);
}

package es.autoocasion;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PurchaseLeadRepository extends JpaRepository<PurchaseLead, Long> {
  List<PurchaseLead> findAllByOrderByCreatedAtDesc();
  List<PurchaseLead> findAllByDeletedAtIsNullOrderByCreatedAtDesc();
  List<PurchaseLead> findAllByDeletedAtIsNotNullOrderByDeletedAtDesc();
  Optional<PurchaseLead> findTopByPhoneAndBrandAndModelOrderByCreatedAtDesc(String phone, String brand, String model);
}

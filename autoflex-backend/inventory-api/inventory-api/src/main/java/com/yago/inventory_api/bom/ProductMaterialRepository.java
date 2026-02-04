package com.yago.inventory_api.bom;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductMaterialRepository extends JpaRepository<ProductMaterial, Long> {

    List<ProductMaterial> findByProductId(Long productId);

    Optional<ProductMaterial> findByIdAndProductId(Long id, Long productId);

    boolean existsByProductIdAndRawMaterialId(Long productId, Long rawMaterialId);
}
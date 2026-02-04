package com.yago.inventory_api.rawmaterial;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RawMaterialRepository extends JpaRepository<RawMaterial, Long> {
    Optional<RawMaterial> findByCode(String code);

    boolean existsByCode(String code);
}
package com.yago.inventory_api.bom.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class ProductMaterialCreateRequest {

    @NotNull
    public Long rawMaterialId;

    @NotNull
    @Positive
    public BigDecimal requiredQuantity;
}

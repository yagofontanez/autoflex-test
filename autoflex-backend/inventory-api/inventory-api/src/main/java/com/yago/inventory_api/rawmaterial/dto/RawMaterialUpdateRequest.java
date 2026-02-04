package com.yago.inventory_api.rawmaterial.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public class RawMaterialUpdateRequest {

    @NotBlank
    public String name;

    @NotNull
    @PositiveOrZero
    public BigDecimal stockQuantity;
}

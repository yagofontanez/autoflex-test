package com.yago.inventory_api.product.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class ProductUpdateRequest {

    @NotBlank
    public String name;

    @NotNull
    @Positive
    public BigDecimal price;
}

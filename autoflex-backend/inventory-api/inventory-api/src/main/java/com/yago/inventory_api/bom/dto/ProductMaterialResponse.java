package com.yago.inventory_api.bom.dto;

import java.math.BigDecimal;

public class ProductMaterialResponse {
    public Long id;
    public Long productId;

    public Long rawMaterialId;
    public String rawMaterialCode;
    public String rawMaterialName;

    public BigDecimal requiredQuantity;
}

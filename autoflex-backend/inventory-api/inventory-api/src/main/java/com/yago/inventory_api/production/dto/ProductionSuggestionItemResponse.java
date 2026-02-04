package com.yago.inventory_api.production.dto;

import java.math.BigDecimal;

public class ProductionSuggestionItemResponse {
    public Long productId;
    public String productCode;
    public String productName;
    public BigDecimal unitPrice;
    public Integer producibleQuantity;
    public BigDecimal totalValue;
}

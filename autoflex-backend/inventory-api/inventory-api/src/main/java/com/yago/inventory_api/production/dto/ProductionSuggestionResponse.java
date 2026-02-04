package com.yago.inventory_api.production.dto;

import java.math.BigDecimal;
import java.util.List;

public class ProductionSuggestionResponse {
    public List<ProductionSuggestionItemResponse> items;
    public BigDecimal totalValue;
}

package com.yago.inventory_api.production;

import com.yago.inventory_api.bom.ProductMaterial;
import com.yago.inventory_api.bom.ProductMaterialRepository;
import com.yago.inventory_api.product.Product;
import com.yago.inventory_api.product.ProductRepository;
import com.yago.inventory_api.production.dto.ProductionSuggestionItemResponse;
import com.yago.inventory_api.production.dto.ProductionSuggestionResponse;
import com.yago.inventory_api.rawmaterial.RawMaterial;
import com.yago.inventory_api.rawmaterial.RawMaterialRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
public class ProductionService {
    private final ProductRepository productRepository;
    private final ProductMaterialRepository productMaterialRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public ProductionService(
            ProductRepository productRepository,
            ProductMaterialRepository productMaterialRepository,
            RawMaterialRepository rawMaterialRepository) {
        this.productRepository = productRepository;
        this.productMaterialRepository = productMaterialRepository;
        this.rawMaterialRepository = rawMaterialRepository;
    }

    public ProductionSuggestionResponse suggest() {
        Map<Long, BigDecimal> stockByRawMaterialId = new HashMap<>();
        for (RawMaterial rm : rawMaterialRepository.findAll()) {
            stockByRawMaterialId.put(rm.getId(), rm.getStockQuantity());
        }

        List<Product> products = productRepository.findAllByOrderByPriceDesc();

        List<ProductionSuggestionItemResponse> items = new ArrayList<>();
        BigDecimal grandTotal = BigDecimal.ZERO;

        for (Product p : products) {
            List<ProductMaterial> bom = productMaterialRepository.findByProductId(p.getId());

            if (bom.isEmpty())
                continue;

            Integer maxUnits = calculateMaxUnits(bom, stockByRawMaterialId);

            if (maxUnits <= 0)
                continue;

            for (ProductMaterial pm : bom) {
                Long rmId = pm.getRawMaterial().getId();
                BigDecimal currentStock = stockByRawMaterialId.getOrDefault(rmId, BigDecimal.ZERO);

                BigDecimal consumption = pm.getRequiredQuantity().multiply(BigDecimal.valueOf(maxUnits));
                stockByRawMaterialId.put(rmId, currentStock.subtract(consumption));
            }

            ProductionSuggestionItemResponse r = new ProductionSuggestionItemResponse();
            r.productId = p.getId();
            r.productCode = p.getCode();
            r.productName = p.getName();
            r.unitPrice = p.getPrice();
            r.producibleQuantity = maxUnits;
            r.totalValue = p.getPrice().multiply(BigDecimal.valueOf(maxUnits));

            items.add(r);
            grandTotal = grandTotal.add(r.totalValue);
        }

        ProductionSuggestionResponse resp = new ProductionSuggestionResponse();
        resp.items = items;
        resp.totalValue = grandTotal;
        return resp;
    }

    private Integer calculateMaxUnits(List<ProductMaterial> bom, Map<Long, BigDecimal> stockByRawMaterialId) {
        Integer max = null;

        for (ProductMaterial pm : bom) {
            Long rmId = pm.getRawMaterial().getId();
            BigDecimal stock = stockByRawMaterialId.getOrDefault(rmId, BigDecimal.ZERO);
            BigDecimal required = pm.getRequiredQuantity();

            if (required == null || required.compareTo(BigDecimal.ZERO) <= 0) {
                return 0;
            }

            BigDecimal possible = stock.divide(required, 0, RoundingMode.FLOOR);
            int possibleInt = possible.intValue();

            if (max == null || possibleInt < max) {
                max = possibleInt;
            }
        }

        return max == null ? 0 : max;
    }
}

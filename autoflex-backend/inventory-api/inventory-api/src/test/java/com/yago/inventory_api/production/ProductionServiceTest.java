package com.yago.inventory_api.production;

import com.yago.inventory_api.bom.ProductMaterial;
import com.yago.inventory_api.bom.ProductMaterialRepository;
import com.yago.inventory_api.product.Product;
import com.yago.inventory_api.product.ProductRepository;
import com.yago.inventory_api.rawmaterial.RawMaterial;
import com.yago.inventory_api.rawmaterial.RawMaterialRepository;
import com.yago.inventory_api.production.dto.ProductionSuggestionResponse;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductionServiceTest {

    @Test
    void shouldPrioritizeHigherPriceAndConsumeStock() {
        ProductRepository productRepository = mock(ProductRepository.class);
        ProductMaterialRepository productMaterialRepository = mock(ProductMaterialRepository.class);
        RawMaterialRepository rawMaterialRepository = mock(RawMaterialRepository.class);

        ProductionService service = new ProductionService(productRepository, productMaterialRepository,
                rawMaterialRepository);

        RawMaterial rm1 = new RawMaterial();
        rm1.setId(1L);
        rm1.setCode("RM001");
        rm1.setName("Steel");
        rm1.setStockQuantity(new BigDecimal("10"));

        when(rawMaterialRepository.findAll()).thenReturn(List.of(rm1));

        Product p1 = new Product();
        p1.setId(1L);
        p1.setCode("P001");
        p1.setName("Expensive");
        p1.setPrice(new BigDecimal("1000"));

        Product p2 = new Product();
        p2.setId(2L);
        p2.setCode("P002");
        p2.setName("Cheap");
        p2.setPrice(new BigDecimal("100"));

        when(productRepository.findAllByOrderByPriceDesc()).thenReturn(List.of(p1, p2));

        ProductMaterial p1m = new ProductMaterial();
        p1m.setId(11L);
        p1m.setProduct(p1);
        p1m.setRawMaterial(rm1);
        p1m.setRequiredQuantity(new BigDecimal("2"));

        ProductMaterial p2m = new ProductMaterial();
        p2m.setId(22L);
        p2m.setProduct(p2);
        p2m.setRawMaterial(rm1);
        p2m.setRequiredQuantity(new BigDecimal("1"));

        when(productMaterialRepository.findByProductId(1L)).thenReturn(List.of(p1m));
        when(productMaterialRepository.findByProductId(2L)).thenReturn(List.of(p2m));

        ProductionSuggestionResponse resp = service.suggest();

        assertNotNull(resp);
        assertEquals(1, resp.items.size(), "Only the expensive product should be produced");
        assertEquals("P001", resp.items.get(0).productCode);
        assertEquals(5, resp.items.get(0).producibleQuantity);
        assertEquals(new BigDecimal("5000"), resp.totalValue);
    }

    @Test
    void shouldSkipProductsWithoutBom() {
        ProductRepository productRepository = mock(ProductRepository.class);
        ProductMaterialRepository productMaterialRepository = mock(ProductMaterialRepository.class);
        RawMaterialRepository rawMaterialRepository = mock(RawMaterialRepository.class);

        ProductionService service = new ProductionService(productRepository, productMaterialRepository,
                rawMaterialRepository);

        when(rawMaterialRepository.findAll()).thenReturn(List.of());

        Product p = new Product();
        p.setId(1L);
        p.setCode("P001");
        p.setName("No BOM");
        p.setPrice(new BigDecimal("10"));

        when(productRepository.findAllByOrderByPriceDesc()).thenReturn(List.of(p));
        when(productMaterialRepository.findByProductId(1L)).thenReturn(List.of());

        ProductionSuggestionResponse resp = service.suggest();

        assertTrue(resp.items.isEmpty());
        assertEquals(BigDecimal.ZERO, resp.totalValue);
    }
}
package com.yago.inventory_api.bom;

import com.yago.inventory_api.bom.dto.ProductMaterialCreateRequest;
import com.yago.inventory_api.bom.dto.ProductMaterialResponse;
import com.yago.inventory_api.bom.dto.ProductMaterialUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products/{productId}/materials")
public class ProductMaterialController {

    private final ProductMaterialService service;

    public ProductMaterialController(ProductMaterialService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProductMaterialResponse add(@PathVariable Long productId,
            @Valid @RequestBody ProductMaterialCreateRequest req) {
        return service.addToProduct(productId, req);
    }

    @GetMapping
    public List<ProductMaterialResponse> list(@PathVariable Long productId) {
        return service.listByProduct(productId);
    }

    @PutMapping("/{productMaterialId}")
    public ProductMaterialResponse update(
            @PathVariable Long productId,
            @PathVariable Long productMaterialId,
            @Valid @RequestBody ProductMaterialUpdateRequest req) {
        return service.updateRequiredQuantity(productId, productMaterialId, req);
    }

    @DeleteMapping("/{productMaterialId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remove(@PathVariable Long productId, @PathVariable Long productMaterialId) {
        service.removeFromProduct(productId, productMaterialId);
    }
}

package com.yago.inventory_api.production;

import com.yago.inventory_api.production.dto.ProductionSuggestionResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/production")
public class ProductionController {

    private final ProductionService service;

    public ProductionController(ProductionService service) {
        this.service = service;
    }

    @GetMapping("/suggestions")
    public ProductionSuggestionResponse suggest() {
        return service.suggest();
    }
}

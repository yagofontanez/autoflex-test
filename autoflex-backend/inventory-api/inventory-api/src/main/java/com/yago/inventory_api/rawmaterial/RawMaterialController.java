package com.yago.inventory_api.rawmaterial;

import com.yago.inventory_api.rawmaterial.dto.RawMaterialCreateRequest;
import com.yago.inventory_api.rawmaterial.dto.RawMaterialResponse;
import com.yago.inventory_api.rawmaterial.dto.RawMaterialUpdateRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/raw-materials")
public class RawMaterialController {

    private final RawMaterialService service;

    public RawMaterialController(RawMaterialService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RawMaterialResponse create(@Valid @RequestBody RawMaterialCreateRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<RawMaterialResponse> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public RawMaterialResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public RawMaterialResponse update(@PathVariable Long id, @Valid @RequestBody RawMaterialUpdateRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

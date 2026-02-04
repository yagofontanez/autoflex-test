package com.yago.inventory_api.rawmaterial;

import com.yago.inventory_api.rawmaterial.dto.RawMaterialCreateRequest;
import com.yago.inventory_api.rawmaterial.dto.RawMaterialResponse;
import com.yago.inventory_api.rawmaterial.dto.RawMaterialUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yago.inventory_api.common.exception.ConflictException;
import com.yago.inventory_api.common.exception.NotFoundException;

import java.util.List;

@Service
public class RawMaterialService {

    private final RawMaterialRepository repository;

    public RawMaterialService(RawMaterialRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public RawMaterialResponse create(RawMaterialCreateRequest req) {
        if (repository.existsByCode(req.code)) {
            throw new ConflictException("Raw material code already exists");
        }

        RawMaterial rm = new RawMaterial();
        rm.setCode(req.code);
        rm.setName(req.name);
        rm.setStockQuantity(req.stockQuantity);

        RawMaterial saved = repository.save(rm);
        return toResponse(saved);
    }

    public List<RawMaterialResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public RawMaterialResponse findById(Long id) {
        RawMaterial rm = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Raw material not found."));
        return toResponse(rm);
    }

    @Transactional
    public RawMaterialResponse update(Long id, RawMaterialUpdateRequest req) {
        RawMaterial rm = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Raw material not found."));

        rm.setName(req.name);
        rm.setStockQuantity(req.stockQuantity);

        RawMaterial saved = repository.save(rm);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Raw material not found.");
        }
        repository.deleteById(id);
    }

    private RawMaterialResponse toResponse(RawMaterial rm) {
        RawMaterialResponse r = new RawMaterialResponse();
        r.id = rm.getId();
        r.code = rm.getCode();
        r.name = rm.getName();
        r.stockQuantity = rm.getStockQuantity();
        return r;
    }
}

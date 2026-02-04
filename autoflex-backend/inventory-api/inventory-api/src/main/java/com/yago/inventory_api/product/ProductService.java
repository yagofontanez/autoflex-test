package com.yago.inventory_api.product;

import com.yago.inventory_api.product.dto.ProductCreateRequest;
import com.yago.inventory_api.product.dto.ProductResponse;
import com.yago.inventory_api.product.dto.ProductUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yago.inventory_api.common.exception.ConflictException;
import com.yago.inventory_api.common.exception.NotFoundException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ProductResponse create(ProductCreateRequest req) {
        if (repository.existsByCode(req.code)) {
            throw new ConflictException("Product code already exists");
        }

        Product p = new Product();
        p.setCode(req.code);
        p.setName(req.name);
        p.setPrice(req.price);

        Product saved = repository.save(p);
        return toResponse(saved);
    }

    public List<ProductResponse> findAll() {
        return repository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse findById(Long id) {
        Product p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found."));
        return toResponse(p);
    }

    @Transactional
    public ProductResponse update(Long id, ProductUpdateRequest req) {
        Product p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found."));

        p.setName(req.name);
        p.setPrice(req.price);

        Product saved = repository.save(p);
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Product not found.");
        }
        repository.deleteById(id);
    }

    private ProductResponse toResponse(Product p) {
        ProductResponse r = new ProductResponse();
        r.id = p.getId();
        r.code = p.getCode();
        r.name = p.getName();
        r.price = p.getPrice();
        return r;
    }
}

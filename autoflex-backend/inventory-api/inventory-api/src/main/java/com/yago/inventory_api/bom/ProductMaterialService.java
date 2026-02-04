package com.yago.inventory_api.bom;

import com.yago.inventory_api.bom.dto.ProductMaterialCreateRequest;
import com.yago.inventory_api.bom.dto.ProductMaterialResponse;
import com.yago.inventory_api.bom.dto.ProductMaterialUpdateRequest;
import com.yago.inventory_api.product.Product;
import com.yago.inventory_api.product.ProductRepository;
import com.yago.inventory_api.rawmaterial.RawMaterial;
import com.yago.inventory_api.rawmaterial.RawMaterialRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.yago.inventory_api.common.exception.ConflictException;
import com.yago.inventory_api.common.exception.NotFoundException;

import java.util.List;

@Service
public class ProductMaterialService {

    private final ProductMaterialRepository productMaterialRepository;
    private final ProductRepository productRepository;
    private final RawMaterialRepository rawMaterialRepository;

    public ProductMaterialService(
            ProductMaterialRepository productMaterialRepository,
            ProductRepository productRepository,
            RawMaterialRepository rawMaterialRepository) {
        this.productMaterialRepository = productMaterialRepository;
        this.productRepository = productRepository;
        this.rawMaterialRepository = rawMaterialRepository;
    }

    @Transactional
    public ProductMaterialResponse addToProduct(Long productId, ProductMaterialCreateRequest req) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found."));

        RawMaterial rawMaterial = rawMaterialRepository.findById(req.rawMaterialId)
                .orElseThrow(() -> new NotFoundException("Raw material not found."));

        if (productMaterialRepository.existsByProductIdAndRawMaterialId(productId, req.rawMaterialId)) {
            throw new ConflictException("Raw material already added to this product.");
        }

        ProductMaterial pm = new ProductMaterial();
        pm.setProduct(product);
        pm.setRawMaterial(rawMaterial);
        pm.setRequiredQuantity(req.requiredQuantity);

        ProductMaterial saved = productMaterialRepository.save(pm);
        return toResponse(saved);
    }

    public List<ProductMaterialResponse> listByProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new NotFoundException("Product not found.");
        }

        return productMaterialRepository.findByProductId(productId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ProductMaterialResponse updateRequiredQuantity(Long productId, Long productMaterialId,
            ProductMaterialUpdateRequest req) {
        ProductMaterial pm = productMaterialRepository.findByIdAndProductId(productMaterialId, productId)
                .orElseThrow(() -> new NotFoundException("Product material not found."));

        pm.setRequiredQuantity(req.requiredQuantity);

        ProductMaterial saved = productMaterialRepository.save(pm);
        return toResponse(saved);
    }

    @Transactional
    public void removeFromProduct(Long productId, Long productMaterialId) {
        ProductMaterial pm = productMaterialRepository.findByIdAndProductId(productMaterialId, productId)
                .orElseThrow(() -> new NotFoundException("Product material not found."));

        productMaterialRepository.delete(pm);
    }

    private ProductMaterialResponse toResponse(ProductMaterial pm) {
        ProductMaterialResponse r = new ProductMaterialResponse();
        r.id = pm.getId();
        r.productId = pm.getProduct().getId();
        r.rawMaterialId = pm.getRawMaterial().getId();
        r.rawMaterialCode = pm.getRawMaterial().getCode();
        r.rawMaterialName = pm.getRawMaterial().getName();
        r.requiredQuantity = pm.getRequiredQuantity();
        return r;
    }
}

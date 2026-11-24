package com.shopsphere.service;

import com.shopsphere.dto.AddCartItemRequest;
import com.shopsphere.dto.CartItemResponse;
import com.shopsphere.dto.CartResponse;
import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.NotFoundException;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository,
                       ProductService productService) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productService = productService;
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        return toCartResponse(cartItemRepository.findCartOfUser(userId));
    }

    @Transactional
    public CartResponse addItem(Long userId, AddCartItemRequest request) {
        Product product = productService.findActiveProduct(request.productId());
        int requested = request.quantity();

        CartItem existing = cartItemRepository
                .findByUserIdAndProductId(userId, product.getId())
                .orElse(null);

        int newQuantity = (existing == null ? 0 : existing.getQuantity()) + requested;
        checkStock(product, newQuantity);

        if (existing == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new NotFoundException("User not found"));
            cartItemRepository.save(new CartItem(user, product, newQuantity));
        } else {
            existing.setQuantity(newQuantity);
            cartItemRepository.save(existing);
        }
        return getCart(userId);
    }

    @Transactional
    public CartResponse updateQuantity(Long userId, Long cartItemId, int quantity) {
        CartItem item = findOwnedItem(userId, cartItemId);
        checkStock(item.getProduct(), quantity);
        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return getCart(userId);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long cartItemId) {
        CartItem item = findOwnedItem(userId, cartItemId);
        cartItemRepository.delete(item);
        return getCart(userId);
    }

    private CartItem findOwnedItem(Long userId, Long cartItemId) {
        return cartItemRepository.findByIdAndUserId(cartItemId, userId)
                .orElseThrow(() -> new NotFoundException("Cart item not found"));
    }

    private void checkStock(Product product, int quantity) {
        if (quantity < 1) {
            throw new BadRequestException("Quantity must be at least 1");
        }
        if (quantity > product.getStock()) {
            throw new BadRequestException(
                    "Only " + product.getStock() + " unit(s) of " + product.getName() + " are available");
        }
    }

    private CartResponse toCartResponse(List<CartItem> items) {
        List<CartItemResponse> lines = items.stream()
                .map(item -> {
                    BigDecimal unitPrice = item.getProduct().getPrice();
                    BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(item.getQuantity()));
                    return new CartItemResponse(
                            item.getId(),
                            item.getProduct().getId(),
                            item.getProduct().getName(),
                            unitPrice,
                            item.getQuantity(),
                            lineTotal,
                            item.getProduct().getStock());
                })
                .toList();

        BigDecimal total = lines.stream()
                .map(CartItemResponse::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int itemCount = lines.stream().mapToInt(CartItemResponse::quantity).sum();
        return new CartResponse(lines, itemCount, total);
    }
}

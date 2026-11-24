package com.shopsphere.service;

import com.shopsphere.dto.OrderItemResponse;
import com.shopsphere.dto.OrderResponse;
import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.Order;
import com.shopsphere.entity.OrderItem;
import com.shopsphere.entity.OrderStatus;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.NotFoundException;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse checkout(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findCartOfUser(userId);
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Your cart is empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Order order = new Order(user);

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            if (!product.isActive()) {
                throw new BadRequestException(product.getName() + " is no longer available");
            }
            if (cartItem.getQuantity() > product.getStock()) {
                throw new BadRequestException("Insufficient stock for " + product.getName());
            }

            BigDecimal unitPrice = product.getPrice();
            order.addItem(new OrderItem(product, product.getName(), unitPrice, cartItem.getQuantity()));

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        Order saved = orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);

        return toResponse(saved, true);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findMyOrders(Long userId) {
        return orderRepository.findByUserIdOrderByIdDesc(userId).stream()
                .map(order -> toResponse(order, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse findMyOrder(Long userId, Long orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        return toResponse(order, true);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAllForAdmin() {
        return orderRepository.findAllByOrderByIdDesc().stream()
                .map(order -> toResponse(order, true))
                .toList();
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new BadRequestException("A " + order.getStatus() + " order cannot be changed");
        }
        order.setStatus(status);
        return toResponse(orderRepository.save(order), true);
    }

    private OrderResponse toResponse(Order order, boolean includeItems) {
        List<OrderItemResponse> items = includeItems
                ? order.getItems().stream().map(this::toItemResponse).toList()
                : List.of();

        return new OrderResponse(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getName(),
                order.getUser().getEmail(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                items);
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProductName(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getLineTotal());
    }
}

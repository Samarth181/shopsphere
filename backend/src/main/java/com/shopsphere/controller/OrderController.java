package com.shopsphere.controller;

import com.shopsphere.dto.OrderResponse;
import com.shopsphere.security.CurrentUser;
import com.shopsphere.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final CurrentUser currentUser;

    public OrderController(OrderService orderService, CurrentUser currentUser) {
        this.orderService = orderService;
        this.currentUser = currentUser;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout() {
        OrderResponse order = orderService.checkout(currentUser.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> myOrders() {
        return ResponseEntity.ok(orderService.findMyOrders(currentUser.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> myOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.findMyOrder(currentUser.getId(), id));
    }
}

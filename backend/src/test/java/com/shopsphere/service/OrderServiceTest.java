package com.shopsphere.service;

import com.shopsphere.dto.OrderResponse;
import com.shopsphere.entity.CartItem;
import com.shopsphere.entity.Category;
import com.shopsphere.entity.Order;
import com.shopsphere.entity.OrderItem;
import com.shopsphere.entity.OrderStatus;
import com.shopsphere.entity.Product;
import com.shopsphere.entity.Role;
import com.shopsphere.entity.User;
import com.shopsphere.exception.BadRequestException;
import com.shopsphere.exception.NotFoundException;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    private OrderService orderService;
    private User customer;

    @BeforeEach
    void setUp() {
        orderService = new OrderService(orderRepository, cartItemRepository, productRepository, userRepository);
        customer = newUser(2L, "Demo Customer", "customer@shopsphere.test");
    }

    @Test
    @DisplayName("Checkout creates order items with purchase-time prices and reduces stock")
    void checkoutCreatesOrderItemsAndReducesStock() throws Exception {
        Product mouse = newProduct(1L, "Wireless Mouse", "649.00", 10);
        CartItem cartItem = new CartItem(customer, mouse, 2);

        when(cartItemRepository.findCartOfUser(2L)).thenReturn(List.of(cartItem));
        when(userRepository.findById(2L)).thenReturn(Optional.of(customer));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.checkout(2L);

        assertEquals(new BigDecimal("1298.00"), response.totalAmount());
        assertEquals(OrderStatus.PLACED, response.status());
        assertEquals(1, response.items().size());
        assertEquals(new BigDecimal("649.00"), response.items().get(0).unitPrice());
        assertEquals(2, response.items().get(0).quantity());

        ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(productCaptor.capture());
        assertEquals(8, productCaptor.getValue().getStock());

        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(orderCaptor.capture());
        OrderItem savedItem = orderCaptor.getValue().getItems().get(0);
        assertEquals("Wireless Mouse", savedItem.getProductName());
        assertEquals(new BigDecimal("649.00"), savedItem.getUnitPrice());

        verify(cartItemRepository).deleteAll(List.of(cartItem));

        mouse.setPrice(new BigDecimal("999.00"));
        assertEquals(new BigDecimal("649.00"), savedItem.getUnitPrice());
        assertEquals(new BigDecimal("649.00"), response.items().get(0).unitPrice());
    }

    @Test
    @DisplayName("Checkout with insufficient stock fails and saves no order")
    void checkoutWithInsufficientStockSavesNoOrder() {
        Product keyboard = newProduct(2L, "Mechanical Keyboard", "2299.00", 1);
        CartItem cartItem = new CartItem(customer, keyboard, 4);

        when(cartItemRepository.findCartOfUser(2L)).thenReturn(List.of(cartItem));
        when(userRepository.findById(2L)).thenReturn(Optional.of(customer));

        BadRequestException ex = assertThrows(BadRequestException.class, () -> orderService.checkout(2L));

        assertEquals("Insufficient stock for Mechanical Keyboard", ex.getMessage());
        assertEquals(400, ex.getStatus().value());

        verify(orderRepository, never()).save(any(Order.class));
        verify(productRepository, never()).save(any(Product.class));
        verify(cartItemRepository, never()).deleteAll(any());
        assertEquals(1, keyboard.getStock());
    }

    @Test
    @DisplayName("A customer cannot view another customer's order")
    void customerCannotViewAnotherCustomersOrder() {

        when(orderRepository.findByIdAndUserId(99L, 2L)).thenReturn(Optional.empty());

        NotFoundException ex = assertThrows(NotFoundException.class,
                () -> orderService.findMyOrder(2L, 99L));

        assertEquals("Order not found", ex.getMessage());
        assertEquals(404, ex.getStatus().value());
        verify(orderRepository).findByIdAndUserId(99L, 2L);
        verify(orderRepository, never()).findById(anyLong());
    }

    @Test
    @DisplayName("Checkout with an empty cart fails before touching the database")
    void checkoutWithEmptyCartFails() {
        when(cartItemRepository.findCartOfUser(2L)).thenReturn(List.of());

        BadRequestException ex = assertThrows(BadRequestException.class, () -> orderService.checkout(2L));

        assertEquals("Your cart is empty", ex.getMessage());
        verify(orderRepository, never()).save(any(Order.class));
    }

    private User newUser(Long id, String name, String email) {
        User user = new User(name, email, "$2a$10$notarealhashusedintests", Role.CUSTOMER);
        setField(user, "id", id);
        return user;
    }

    private Product newProduct(Long id, String name, String price, int stock) {
        Category category = newCategory();
        Product product = new Product(name, "Test product", new BigDecimal(price), stock, category);
        setField(product, "id", id);
        return product;
    }

    private Category newCategory() {
        try {
            var constructor = Category.class.getDeclaredConstructor();
            constructor.setAccessible(true);
            Category category = constructor.newInstance();
            setField(category, "id", 1L);
            category.setName("Electronics");
            return category;
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException("Cannot create Category", e);
        }
    }

    private void setField(Object target, String fieldName, Object value) {
        try {
            Field field = target.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(target, value);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException("Cannot set " + fieldName, e);
        }
    }
}

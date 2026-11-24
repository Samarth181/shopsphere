package com.shopsphere.service;

import com.shopsphere.dto.RegisterRequest;
import com.shopsphere.dto.UserResponse;
import com.shopsphere.entity.Role;
import com.shopsphere.entity.User;
import com.shopsphere.exception.ConflictException;
import com.shopsphere.repository.UserRepository;
import com.shopsphere.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(userRepository, new BCryptPasswordEncoder(), jwtService);
    }

    @Test
    @DisplayName("Registration stores a BCrypt hash, never the plain password")
    void registrationStoresBcryptHash() {
        RegisterRequest request = new RegisterRequest("Asha", "asha@example.com", "Secret@12345");
        when(userRepository.existsByEmail("asha@example.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponse response = authService.register(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        String stored = captor.getValue().getPasswordHash();

        assertNotEquals("Secret@12345", stored);
        assertFalse(stored.contains("Secret@12345"));

        assertTrue(stored.startsWith("$2a$10$"), "expected a BCrypt hash, got: " + stored);
        assertEquals(60, stored.length());

        assertTrue(new BCryptPasswordEncoder().matches("Secret@12345", stored));

        assertEquals(Role.CUSTOMER, captor.getValue().getRole());
        assertEquals("asha@example.com", response.email());
    }

    @Test
    @DisplayName("Registering an email that already exists is rejected with 409")
    void registrationWithDuplicateEmailIsRejected() {
        RegisterRequest request = new RegisterRequest("Asha", "taken@example.com", "Secret@12345");
        when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class, () -> authService.register(request));

        assertEquals("An account with this email already exists", ex.getMessage());
        assertEquals(409, ex.getStatus().value());

        verify(userRepository, never()).save(any(User.class));
    }
}

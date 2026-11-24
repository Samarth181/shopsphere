package com.shopsphere.controller;

import com.shopsphere.dto.AuthResponse;
import com.shopsphere.dto.LoginRequest;
import com.shopsphere.dto.RegisterRequest;
import com.shopsphere.dto.UserResponse;
import com.shopsphere.entity.User;
import com.shopsphere.security.AppUserDetailsService;
import com.shopsphere.security.CurrentUser;
import com.shopsphere.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final AppUserDetailsService userDetailsService;
    private final CurrentUser currentUser;

    public AuthController(AuthService authService,
                          AppUserDetailsService userDetailsService,
                          CurrentUser currentUser) {
        this.authService = authService;
        this.userDetailsService = userDetailsService;
        this.currentUser = currentUser;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse created = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        String email = currentUser.getEmail();
        User user = userDetailsService.loadUserEntity(email);
        return ResponseEntity.ok(authService.toResponse(user));
    }
}

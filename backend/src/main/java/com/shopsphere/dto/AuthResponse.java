package com.shopsphere.dto;

public record AuthResponse(
        String token,
        String tokenType,
        long expiresInSeconds,
        UserResponse user
) {
    public AuthResponse(String token, long expiresInSeconds, UserResponse user) {
        this(token, "Bearer", expiresInSeconds, user);
    }
}

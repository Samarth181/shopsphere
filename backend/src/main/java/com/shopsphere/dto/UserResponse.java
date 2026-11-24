package com.shopsphere.dto;

import com.shopsphere.entity.Role;

public record UserResponse(
        Long id,
        String name,
        String email,
        Role role
) {
}

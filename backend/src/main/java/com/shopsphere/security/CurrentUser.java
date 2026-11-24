package com.shopsphere.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

    public AppUserDetails get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUserDetails details)) {

            throw new IllegalStateException("No authenticated user in the security context");
        }
        return details;
    }

    public Long getId() {
        return get().getId();
    }

    public String getEmail() {
        return get().getUsername();
    }
}

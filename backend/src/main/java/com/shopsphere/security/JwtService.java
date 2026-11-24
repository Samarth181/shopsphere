package com.shopsphere.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtService {

    static final String DEV_DEFAULT_SECRET = "local-dev-only-secret-change-me-0123456789abcdef";

    private final SecretKey secretKey;
    private final Duration expiration;

    public JwtService(@Value("${shopsphere.jwt.secret}") String secret,
                      @Value("${shopsphere.jwt.expiration-minutes}") long expirationMinutes,
                      @Value("${shopsphere.jwt.require-explicit-secret:false}") boolean requireExplicitSecret) {

        if (requireExplicitSecret && (secret == null || secret.isBlank() || DEV_DEFAULT_SECRET.equals(secret))) {
            throw new IllegalStateException(
                    "JWT_SECRET must be set to a private random value of at least 32 characters "
                            + "when the application runs in the prod profile. "
                            + "Generate one with: openssl rand -base64 48");
        }

        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                    "JWT_SECRET must be set and at least 32 characters long");
        }

        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = Duration.ofMinutes(expirationMinutes);
    }

    public String generateToken(Long userId, String email, String role) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expiration)))
                .signWith(secretKey)
                .compact();
    }

    public String extractEmail(String token) {
        Claims claims = parse(token);
        return claims == null ? null : claims.getSubject();
    }

    public long getExpirationSeconds() {
        return expiration.toSeconds();
    }

    public boolean isTokenValid(String token) {
        return parse(token) != null;
    }

    private Claims parse(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException ex) {

            return null;
        }
    }
}

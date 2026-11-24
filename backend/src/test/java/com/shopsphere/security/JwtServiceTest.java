package com.shopsphere.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtServiceTest {

    private static final String REAL_SECRET = "a-private-secret-of-at-least-32-characters-long";
    private static final String OTHER_SECRET = "a-completely-different-secret-of-32-plus-chars";

    @Test
    @DisplayName("Prod profile refuses to start with the public development secret")
    void prodProfileRejectsDefaultSecret() {
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> new JwtService(JwtService.DEV_DEFAULT_SECRET, 60, true));

        assertTrue(ex.getMessage().contains("JWT_SECRET must be set to a private random value"));
    }

    @Test
    @DisplayName("Prod profile refuses to start with a blank secret")
    void prodProfileRejectsBlankSecret() {
        assertThrows(IllegalStateException.class, () -> new JwtService("", 60, true));
    }

    @Test
    @DisplayName("A secret shorter than 32 characters is rejected in every profile")
    void shortSecretIsRejected() {
        assertThrows(IllegalStateException.class, () -> new JwtService("too-short", 60, false));
    }

    @Test
    @DisplayName("A token signed with the real secret is valid and carries the user")
    void tokenIsValidAndCarriesClaims() {
        JwtService jwtService = new JwtService(REAL_SECRET, 60, true);

        String token = jwtService.generateToken(2L, "customer@shopsphere.test", "CUSTOMER");

        assertTrue(jwtService.isTokenValid(token));
        assertEquals("customer@shopsphere.test", jwtService.extractEmail(token));
        assertEquals(3600, jwtService.getExpirationSeconds());
    }

    @Test
    @DisplayName("A token signed with another secret, or a tampered token, is rejected")
    void tokensFromOtherKeysAreRejected() {
        JwtService issuer = new JwtService(REAL_SECRET, 60, true);
        JwtService verifier = new JwtService(OTHER_SECRET, 60, true);

        String foreignToken = issuer.generateToken(2L, "customer@shopsphere.test", "CUSTOMER");
        assertFalse(verifier.isTokenValid(foreignToken));

        int middle = foreignToken.length() / 2;
        char replacement = foreignToken.charAt(middle) == 'A' ? 'B' : 'A';
        String tampered = foreignToken.substring(0, middle) + replacement
                + foreignToken.substring(middle + 1);

        assertFalse(issuer.isTokenValid(tampered));
        assertNotEquals(foreignToken, tampered);
    }
}

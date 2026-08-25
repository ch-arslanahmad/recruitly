package com.recruitly.backend.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
// logging
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
// Spring imports
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JWTUtil {

    public static final Logger log = LoggerFactory.getLogger(JWTUtil.class);

    @Value("${app.jwt.secret}")
    private String SECRET_KEY;

    private final long expiration = 3600;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userID, String userRole) {
        try {
            return Jwts.builder()
                .subject(userID.toString())
                .issuedAt(new Date())
                .expiration(Date.from(Instant.now().plusSeconds(expiration)))
                .claim("role", userRole)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
        } catch (Exception e) {
            log.debug("Error generating token: " + e.getMessage());
            throw new RuntimeException("Error generating token", e);
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            // it throws an exception if the token is invalid.
            return true;
        } catch (Exception e) {
            log.warn("Error verifying token: " + e.getMessage()); // ? warn
            return false;
        }
    }
}

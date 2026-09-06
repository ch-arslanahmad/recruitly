package com.recruitly.backend.controllers;

import com.recruitly.backend.model.User;
import com.recruitly.backend.services.AuthService;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

// jwt

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public static final Logger log = LoggerFactory.getLogger(
        AuthController.class
    );

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            String token = authService.login(user);
            log.info(
                "User: " +
                    user.getUsername() +
                    "(" +
                    user.getId() +
                    ") logged in successfully!"
            );

            return ResponseEntity.ok(
                Map.of("token", token, "user", user.getUserMap())
            );
        } catch (ResponseStatusException e) {
            log.error(
                "Login failed for user: {}, Error: {}",
                user.getUsername(),
                e.getReason()
            );
            throw e;
        } catch (Exception e) {
            log.error("Login failed for user: {}", user.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Login failed")
            );
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            Map<Long, String> result = authService.register(user);
            Long userId = result.keySet().iterator().next();
            String token = result.get(userId);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("token", token, "user", user.getUserMap())
            );
        } catch (ResponseStatusException e) {
            log.error(
                "Registration failed for user: {}, Error: {}",
                user.getUsername(),
                e.getReason()
            );
            throw e;
        } catch (Exception e) {
            log.error(
                "Registration failed for user: {}",
                user.getUsername(),
                e
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Registration failed")
            );
        }
    }
}

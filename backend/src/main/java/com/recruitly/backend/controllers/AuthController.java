package com.recruitly.backend.controllers;

import com.recruitly.backend.model.User;
import com.recruitly.backend.services.AuthService;
import jakarta.validation.Valid;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
        String token = authService.login(user);
        log.info(
            "User: {} ({}) logged in successfully!",
            user.getUsername(),
            user.getId()
        );

        return ResponseEntity.ok(
            Map.of("token", token, "user", user.getUserMap())
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        Map<Long, String> result = authService.register(user);
        Long userId = result.keySet().iterator().next();
        String token = result.get(userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of("token", token, "user", user.getUserMap())
        );
    }
}

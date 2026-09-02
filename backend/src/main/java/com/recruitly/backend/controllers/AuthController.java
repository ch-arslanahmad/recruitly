package com.recruitly.backend.controllers;

import com.recruitly.backend.config.JWTUtil;
import com.recruitly.backend.model.User;
import com.recruitly.backend.repository.UserRepository;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

// jwt

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public static final Logger log = LoggerFactory.getLogger(
        AuthController.class
    );

    private final JWTUtil jwtUtil;

    private final UserRepository userRepo;
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(); // for password hashing

    public AuthController(UserRepository userRepo, JWTUtil jwtUtil) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User oldUser = userRepo
                .findByUsername(user.getUsername())
                .orElse(null);

            // not found check
            if (oldUser == null) {
                log.warn(
                    "User: " +
                        user.getUsername() +
                        "failed to log in due to user not found!"
                );

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("message", "User not found, you must register first")
                );
            }

            // password check
            if (!encoder.matches(user.getPassword(), oldUser.getPassword())) {
                log.warn(
                    "User: " +
                        user.getUsername() +
                        "(" +
                        user.getId() +
                        ") failed to log in due to incorrect password!"
                );
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("message", "Incorrect password")
                );
            }

            if (!(user.getRole() == oldUser.getRole())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("message", "Unauthorized role of user.")
                );
            }

            // generate token
            String token = jwtUtil.generateToken(
                oldUser.getId(),
                oldUser.getRole().toString()
            );

            log.info(
                "User: " +
                    oldUser.getUsername() +
                    "(" +
                    oldUser.getId() +
                    ") logged in successfully!"
            );

            return ResponseEntity.ok(
                Map.of("token", token, "user", oldUser.getUserMap())
            );
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
            if (userRepo.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("message", "Username already exists")
                );
            }

            user.setPassword(encoder.encode(user.getPassword()));

            user.setId(userRepo.create(user));

            String token = jwtUtil.generateToken(
                user.getId(),
                user.getRole().toString()
            );

            log.info(
                "User: " + user.getUsername() + " registered successfully!"
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("token", token, "user", user.getUserMap())
            );
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

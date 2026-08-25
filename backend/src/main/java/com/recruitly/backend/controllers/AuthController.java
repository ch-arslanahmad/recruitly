package com.recruitly.backend.controllers;

import com.recruitly.backend.model.User;
import com.recruitly.backend.repository.UserRepository;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    public static final Logger log = LoggerFactory.getLogger(
        AuthController.class
    );

    

    private final UserRepository userRepo;
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(); // for password hashing

    public AuthController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        User oldUser = userRepo.findByUsername(user.getUsername()).orElse(null);

        if (oldUser == null) {
            log.warn(
                "User: " +
                    user.getUsername() +
                    "(" +
                    user.getId() +
                    ") failed to log in due to user not found!"
            );
            return Map.of("message", "User not found");
        }

        if (!encoder.matches(user.getPassword(), oldUser.getPassword())) {
            log.warn(
                "User: " +
                    user.getUsername() +
                    "(" +
                    user.getId() +
                    ") failed to log in due to incorrect password!"
            );
            return Map.of("message", "Incorrect password");
        } else {
            log.info(
                "User: " +
                    user.getUsername() +
                    "(" +
                    user.getId() +
                    ") logged in successfully!"
            );
            return Map.of("message", "Login successful", "token", "TOKEN");
        }
    }

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword()));

        userRepo.create(user);
        log.info(
            "User: " +
                user.getUsername() +
                "(" +
                user.getId() +
                ") registered successfully!"
        );
        return "TOKEN";
    }
}

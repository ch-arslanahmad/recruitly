package com.recruitly.backend.controllers;

import com.recruitly.backend.model.User;
import com.recruitly.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(
        UserController.class
    );

    public final UserRepository userRepo;

    public UserController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            userRepo.create(user);
            return ResponseEntity.ok("User created");
        } catch (Exception e) {
            log.error(
                "Error creating user: " + user.getUsername(),
                "\n" + e.getMessage()
            );
            return ResponseEntity.badRequest().body("Username already exists");
        }
    }
}

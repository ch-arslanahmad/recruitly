package com.recruitly.backend.services;

import com.recruitly.backend.config.JWTUtil;
import com.recruitly.backend.model.User;
import com.recruitly.backend.repository.UserRepository;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    public static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final JWTUtil jwtUtil;

    private final UserRepository userRepo;
    BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(); // for password hashing

    public AuthService(UserRepository userRepo, JWTUtil jwtUtil) {
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    public String login(User user) {
        User oldUser = userRepo.findByUsername(user.getUsername()).orElse(null);

        // not found check
        if (oldUser == null) {
            log.warn(
                "User: " +
                    user.getUsername() +
                    "failed to log in due to user not found!"
            );

            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "User not found, you must register first"
            );
        }

        // password check
        if (!encoder.matches(user.getPassword(), oldUser.getPassword())) {
            log.warn(
                "User: " +
                    user.getUsername() +
                    ": failed to log in due to incorrect password!"
            );

            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Incorrect password"
            );
        }

        if (!(user.getRole() == oldUser.getRole())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Unauthorized role of user."
            );
        }

        // generate token
        String token = jwtUtil.generateToken(
            oldUser.getId(),
            oldUser.getRole().toString()
        );

        return token;
    }

    public Map<Long, String> register(User user) {
        if (userRepo.findByUsername(user.getUsername()).isPresent()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Username already exists"
            );
        }

        user.setPassword(encoder.encode(user.getPassword())); // set password hash

        user.setId(userRepo.create(user)); // set id of the user

        String token = jwtUtil.generateToken(
            user.getId(),
            user.getRole().toString()
        );

        log.info("User: " + user.getUsername() + " registered successfully!");

        return Map.of(user.getId(), token);
    }
}

package com.recruitly.backend.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.recruitly.backend.config.JWTUtil;
import com.recruitly.backend.model.User;
import com.recruitly.backend.repository.UserRepository;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepo;

    @Mock
    private JWTUtil jwtUtil;

    @Mock
    BCryptPasswordEncoder encoder; // for password hashing

    @InjectMocks
    private AuthService authService;

    @Test
    void login_shouldReturnToken() {
        User user = new User();
        user.setUsername("test");
        user.setRole(User.Role.applicant);

        User oldUser = new User();
        oldUser.setUsername("test");
        oldUser.setRole(User.Role.applicant);

        // find user by username
        when(userRepo.findByUsername("test")).thenReturn(Optional.of(oldUser));

        // password matching
        when(encoder.matches(any(), any())).thenReturn(true);

        when(
            jwtUtil.generateToken(oldUser.getId(), oldUser.getRole().toString())
        ).thenReturn("token");

        assertEquals("token", authService.login(user));
    }

    @Test
    void login_shouldThrow_whenUserNotFound() {
        User user = new User();
        user.setUsername("test");
        when(userRepo.findByUsername("test")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () ->
            authService.login(user)
        );
    }

    @Test
    void login_shouldThrow_whenPasswordIncorrect() {
        User user = new User();
        user.setUsername("test");
        user.setPassword("incorrect");
        when(userRepo.findByUsername("test")).thenReturn(Optional.of(user));
        when(encoder.matches(any(), any())).thenReturn(false);

        assertThrows(ResponseStatusException.class, () ->
            authService.login(user)
        );
    }

    @Test
    void login_shouldThrow_whenRoleMismatch() {
        User user = new User();
        user.setUsername("test");
        user.setRole(User.Role.applicant);

        User oldUser = new User();
        oldUser.setUsername("test");
        oldUser.setRole(User.Role.recruiter);

        when(userRepo.findByUsername("test")).thenReturn(Optional.of(oldUser));

        assertThrows(ResponseStatusException.class, () ->
            authService.login(user)
        );
    }

    @Test
    void register_shouldReturnToken() {
        User user = new User();
        user.setUsername("test");
        user.setRole(User.Role.applicant);

        when(userRepo.findByUsername("test")).thenReturn(Optional.empty());

        when(encoder.encode(any())).thenReturn("encoded");
        when(jwtUtil.generateToken(10L, "applicant")).thenReturn("token");

        when(userRepo.create(any())).thenReturn(10L);

        
        assertEquals(Map.of(10L, "token"), authService.register(user));
    }


    @Test 
    void register_shouldThrow_whenUsernameExists() {
        User user = new User();
        user.setUsername("test");
        when(userRepo.findByUsername("test")).thenReturn(Optional.of(user));

        assertThrows(ResponseStatusException.class, () ->
            authService.register(user)
        );
    }

    // - login_shouldReturnToken 👍
    // - login_shouldThrow_whenUserNotFound 👍
    // - login_shouldThrow_whenPasswordIncorrect 👍
    // - login_shouldThrow_whenRoleMismatch 👍

    // Now register,
    // - register_shouldReturnToken
    // - register_shouldThrow_whenUsernameExists
}

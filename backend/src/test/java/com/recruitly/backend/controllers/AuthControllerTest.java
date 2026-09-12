package com.recruitly.backend.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private String toJson(Object obj) throws Exception {
        return new ObjectMapper().writeValueAsString(obj);
    }

    // register

    @Test
    public void register_shouldReturn201() throws Exception {
        mockMvc
            .perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "name",
                                "Test User",
                                "username",
                                "test_" + System.currentTimeMillis(),
                                "password",
                                "password123",
                                "role",
                                "applicant",
                                "company",
                                "Acme"
                            )
                        )
                    )
            )
            .andExpect(status().isCreated())
            .andDo(print());
    }

    @Test
    public void register_shouldReturn409_WhenUserExist() throws Exception {
        mockMvc
            .perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "name",
                                "Test User",
                                "username",
                                "test",
                                "password",
                                "password123",
                                "role",
                                "applicant",
                                "company",
                                "Acme"
                            )
                        )
                    )
            )
            .andExpect(status().isConflict())
            .andDo(print());
    }

    @Test
    public void register_shouldReturn409_WhenMissingFields() throws Exception {
        mockMvc
            .perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "name",
                                "Test User",
                                "username",
                                "test_" + System.currentTimeMillis(),
                                "password",
                                "password123"
                            )
                        )
                    )
            )
            .andExpect(status().isBadRequest())
            .andDo(print());
    }

    @Test
    public void register_shouldReturn500_whenMissingFields() throws Exception {
        mockMvc
            .perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "name",
                                "Test User",
                                "username",
                                "test_" + System.currentTimeMillis()
                            )
                        )
                    )
            )
            .andExpect(status().isBadRequest())
            .andDo(print());
    }

    // login

    @Test
    public void login_shouldReturn200() throws Exception {
        String username = "logintest_" + System.currentTimeMillis();

        mockMvc
            .perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "name",
                                "Login User",
                                "username",
                                username,
                                "password",
                                "password123",
                                "role",
                                "applicant"
                            )
                        )
                    )
            )
            .andExpect(status().isCreated());

        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "name",
                                "Login User",
                                "username",
                                username,
                                "password",
                                "password123",
                                "role",
                                "applicant"
                            )
                        )
                    )
            )
            .andExpect(status().isOk())
            .andDo(print());
    }

    @Test
    public void login_shouldReturn404_whenUserNotFound() throws Exception {
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "name",
                                "someone",
                                "username",
                                "nonexistent_" + System.currentTimeMillis(),
                                "password",
                                "password123",
                                "role",
                                "applicant"
                            )
                        )
                    )
            )
            .andExpect(status().isNotFound())
            .andDo(print());
    }

    @Test
    public void login_shouldReturn409_whenMissingFields() throws Exception {
        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(Map.of("name", "Test User", "username", "test"))
                    )
            )
            .andExpect(status().isBadRequest())
            .andDo(print());
    }

    @Test
    public void login_shouldReturn401_whenInvalidCredentials()
        throws Exception {
        String username = "wrongpwtest_" + System.currentTimeMillis();

        mockMvc
            .perform(
                post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "name",
                                "Wrong PW User",
                                "username",
                                username,
                                "password",
                                "password123",
                                "role",
                                "applicant"
                            )
                        )
                    )
            )
            .andExpect(status().isCreated());

        mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "name",
                                "Wrong PW User",
                                "username",
                                username,
                                "password",
                                "wrongpassword",
                                "role",
                                "applicant"
                            )
                        )
                    )
            )
            .andExpect(status().isUnauthorized())
            .andDo(print());
    }
}

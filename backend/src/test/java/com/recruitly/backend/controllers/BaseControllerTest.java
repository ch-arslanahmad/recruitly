package com.recruitly.backend.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

public class BaseControllerTest {

    protected final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private MockMvc mockMvc;

    protected String toJson(Object obj) throws Exception {
        return objectMapper.writeValueAsString(obj);
    }

    protected String registerAndLogin(String role) throws Exception {
        String username = role + "_" + System.currentTimeMillis();

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
                                username,
                                "password",
                                "password123",
                                "role",
                                role,
                                "company",
                                "Acme"
                            )
                        )
                    )
            )
            .andExpect(status().isCreated());

        String response = mockMvc
            .perform(
                post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "name",
                                "Test User",
                                "username",
                                username,
                                "password",
                                "password123",
                                "role",
                                role
                            )
                        )
                    )
            )
            .andExpect(status().isOk())
            .andReturn()
            .getResponse()
            .getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }

    protected Long createJob(String token) throws Exception {
        String response = mockMvc
            .perform(
                post("/api/jobs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .content(
                        toJson(
                            Map.of(
                                "title",
                                "Test Job",
                                "status",
                                "open",
                                "company",
                                "Acme",
                                "salary",
                                75000,
                                "type",
                                "full-time",
                                "about_role",
                                "Test Description",
                                "location",
                                "Lahore"
                            )
                        )
                    )
            )
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();

        return objectMapper.readTree(response).get("id").asLong();
    }

    protected Long applyToJob(String applicantToken, Long jobId)
        throws Exception {
        String response = mockMvc
            .perform(
                post("/api/applications")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + applicantToken)
                    .content(
                        toJson(Map.of("job_id", jobId, "status", "applied"))
                    )
            )
            .andExpect(status().isCreated())
            .andReturn()
            .getResponse()
            .getContentAsString();
        return objectMapper.readTree(response).get("id").asLong();
    }
}

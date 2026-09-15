package com.recruitly.backend.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class ApplicationControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // @Test
    // public void apply_shouldReturn201_whenValidApplication() throws Exception {
    //     String token = registerAndLogin("applicant");

    //     mockMvc
    //         .perform(
    //             post("/api/applications")
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .header("Authorization", "Bearer " + token)
    //                 .content(toJson(Map.of("job_id", 1, "status", "applied")))
    //         )
    //         .andExpect(status().isCreated());
    // }

    // @Test
    // public void apply_shouldReturn409_whenAlreadyApplied() throws Exception {
    //     String token = registerAndLogin("applicant");

    //     mockMvc
    //         .perform(
    //             post("/api/applications")
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .header("Authorization", "Bearer " + token)
    //                 .content(toJson(Map.of("job_id", 1, "status", "applied")))
    //         )
    //         .andExpect(status().isConflict());
    // }

    // @Test
    // public void apply_shouldReturn400_whenJobIsClosed() throws Exception {
    //     String token = registerAndLogin("applicant");
    //     mockMvc
    //         .perform(
    //             post("/api/applications")
    //                 .contentType(MediaType.APPLICATION_JSON)
    //                 .header("Authorization", "Bearer " + token)
    //                 .content(toJson(Map.of("job_id", 1, "status", "applied")))
    //         )
    //         .andExpect(status().isBadRequest());
    // }

    @Test
    public void myApplications_shouldReturn200() throws Exception {
        String token = registerAndLogin("applicant");

        mockMvc
            .perform(
                get("/api/applications/my")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
            )
            .andExpect(status().isOk());
    }
}

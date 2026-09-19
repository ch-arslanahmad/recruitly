package com.recruitly.backend.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class JobControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void getJobs_shouldReturn200() throws Exception {
        mockMvc
            .perform(get("/api/jobs").contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());
    }

    @Test
    public void getMyJobs_shouldReturn200() throws Exception {
        String token = registerAndLogin("recruiter");

        mockMvc
            .perform(
                get("/api/jobs/my")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
            )

            .andExpect(status().isOk());
    }

    @Test
    public void getStats_shouldReturn200() throws Exception {
        String token = registerAndLogin("recruiter");

        mockMvc
            .perform(
                get("/api/jobs/stats")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
            )
            .andExpect(status().isOk());
    }

    @Test
    public void createJob_shouldReturn201() throws Exception {
        String token = registerAndLogin("recruiter");
        mockMvc
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
                                "closed",
                                "company",
                                "Test Corp",
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
            .andExpect(status().isCreated());
    }

    @Test
    public void createJob_shouldReturn400_whenEmptyFields() throws Exception {
        String token = registerAndLogin("recruiter");

        mockMvc
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
                                "closed",
                                "company",
                                "Test Corp",
                                "salary",
                                -75000,
                                "type",
                                "invalid-type",
                                "about_role",
                                "Test Description"
                            )
                        )
                    )
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    public void deleteJob_shouldReturn200_whenJobDeleted() throws Exception {
        String token = registerAndLogin("recruiter");

        Long id = createJob(token);

        mockMvc
            .perform(
                delete("/api/jobs/" + id).header(
                    "Authorization",
                    "Bearer " + token
                )
            )
            .andExpect(status().isOk());
    }

    @Test
    public void deleteJob_shouldReturn404_whenJobNotFound() throws Exception {
        String token = registerAndLogin("recruiter");

        mockMvc
            .perform(
                delete("/api/jobs/999").header(
                    "Authorization",
                    "Bearer " + token
                )
            )
            .andExpect(status().isNotFound());
    }

    @Test
    public void deleteJob_wrongRecruiter_shouldReturn404() throws Exception {
        String token1 = registerAndLogin("recruiter");

        Long id = createJob(token1);

        String token2 = registerAndLogin("recruiter");

        mockMvc
            .perform(
                delete("/api/jobs/" + id).header(
                    "Authorization",
                    "Bearer " + token2
                )
            )
            .andExpect(status().isNotFound());
    }

    // get single job

    @Test
    public void getJobById_shouldReturn200() throws Exception {
        String token = registerAndLogin("recruiter");

        Long id = createJob(token);

        mockMvc
            .perform(
                get("/api/jobs/" + id).header(
                    "Authorization",
                    "Bearer " + token
                )
            )
            .andExpect(status().isOk());
    }

    @Test
    public void getJobById_shouldReturn404_WhennotFound() throws Exception {
        String token = registerAndLogin("recruiter");

        mockMvc
            .perform(
                get("/api/jobs/999").header("Authorization", "Bearer " + token)
            )
            .andExpect(status().isNotFound());
    }

    // auth/validation
    @Test
    public void createJob_noAuth_shouldReturn401() throws Exception {
        mockMvc
            .perform(
                post("/api/jobs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        toJson(
                            Map.of(
                                "title",
                                "Test Job",
                                "status",
                                "closed",
                                "company",
                                "Test Corp",
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
            .andExpect(status().isUnauthorized());
    }

    // update
    @Test
    public void updateJob_shouldReturn200() throws Exception {
        String token = registerAndLogin("recruiter");

        Long id = createJob(token);

        mockMvc
            .perform(
                put("/api/jobs/" + id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .content(
                        toJson(
                            Map.of(
                                "title",
                                "Updated Job",
                                "status",
                                "open",
                                "company",
                                "Updated Corp",
                                "salary",
                                80000,
                                "type",
                                "part-time",
                                "about_role",
                                "Updated Description",
                                "location",
                                "Karachi"
                            )
                        )
                    )
            )
            .andExpect(status().isOk());
    }

    @Test
    public void updateJob_shouldReturn404_whenJobNotFound() throws Exception {
        String token = registerAndLogin("recruiter");

        mockMvc
            .perform(
                put("/api/jobs/999")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .content(
                        toJson(
                            Map.of(
                                "title",
                                "Updated Job",
                                "status",
                                "open",
                                "company",
                                "Updated Corp",
                                "salary",
                                80000,
                                "type",
                                "part-time",
                                "about_role",
                                "Updated Description",
                                "location",
                                "Karachi"
                            )
                        )
                    )
            )
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateJob_shouldReturn403_whenUnauthorizedRecruiter()
        throws Exception {
        String token = registerAndLogin("recruiter");

        Long id = createJob(token);

        String token2 = registerAndLogin("recruiter");

        mockMvc
            .perform(
                put("/api/jobs/" + id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token2)
                    .content(
                        toJson(
                            Map.of(
                                "title",
                                "Updated Job",
                                "status",
                                "open",
                                "company",
                                "Updated Corp",
                                "salary",
                                80000,
                                "type",
                                "part-time",
                                "about_role",
                                "Updated Description",
                                "location",
                                "Karachi"
                            )
                        )
                    )
            )
            .andExpect(status().isForbidden());
    }

    @Test
    public void updateJob_shouldReturn403_whenApplicantCreatesJob()
        throws Exception {
        String token = registerAndLogin("recruiter");
        String token2 = registerAndLogin("applicant");

        Long id = createJob(token); // recruiter token to generate the job

        mockMvc
            .perform(
                put("/api/jobs/" + id)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token2) // applicant token to test the permission
                    .content(
                        toJson(
                            Map.of(
                                "title",
                                "Updated Job",
                                "status",
                                "open",
                                "company",
                                "Updated Corp",
                                "salary",
                                80000,
                                "type",
                                "part-time",
                                "about_role",
                                "Updated Description",
                                "location",
                                "Karachi"
                            )
                        )
                    )
            )
            .andExpect(status().isForbidden());
    }
}

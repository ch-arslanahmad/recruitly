package com.recruitly.backend.controllers;

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
public class ApplicationControllerTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void apply_shouldReturn201_whenValidApplication() throws Exception {
        String recruiter_token = registerAndLogin("recruiter");
        Long jobId = createJob(recruiter_token);

        String token = registerAndLogin("applicant");

        mockMvc
            .perform(
                post("/api/applications")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .content(toJson(Map.of("job_id", jobId, "status", "applied")))
            )
            .andExpect(status().isCreated());
    }

    @Test
    public void apply_shouldReturn409_whenAlreadyApplied() throws Exception {
        String recruiter_token = registerAndLogin("recruiter");
        Long jobId = createJob(recruiter_token);

        String token = registerAndLogin("applicant");

        mockMvc.perform(
            post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token)
                .content(toJson(Map.of("job_id", jobId, "status", "applied")))
        );

        mockMvc
            .perform(
                post("/api/applications")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .content(toJson(Map.of("job_id", jobId, "status", "applied")))
            )
            .andExpect(status().isConflict());
    }

    // apply
    //
    @Test
    public void apply_shouldReturn400_whenJobIsClosed() throws Exception {
        String recruiter_token = registerAndLogin("recruiter");
        Long jobId = createJob(recruiter_token); // create job with recruiter token
        String token = registerAndLogin("applicant");

        // close the job
        mockMvc.perform(
            put("/api/jobs/" + jobId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(toJson(Map.of("status", "closed")))
                .header("Authorization", "Bearer " + recruiter_token)
        );

        // now apply to closed job
        mockMvc
            .perform(
                post("/api/applications")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
                    .content(
                        toJson(Map.of("job_id", jobId, "status", "applied"))
                    )
            )
            .andExpect(status().isBadRequest());
    }

    // get applications
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

    @Test
    public void myApplications_shouldReturn401_whenNoAuth() throws Exception {
        mockMvc
            .perform(
                get("/api/applications/my").contentType(
                    MediaType.APPLICATION_JSON
                )
            )
            .andExpect(status().isUnauthorized());
    }

    // recruiter applicants
    @Test
    public void recruiterApplicants_shouldReturn200() throws Exception {
        String token = registerAndLogin("recruiter");

        mockMvc
            .perform(
                get("/api/applications/applicants")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token)
            )
            .andExpect(status().isOk());
    }

    @Test
    public void recruiterApplicants_shouldReturn401_whenNoAuth()
        throws Exception {
        mockMvc
            .perform(
                get("/api/applications/applicants").contentType(
                    MediaType.APPLICATION_JSON
                )
            )
            .andExpect(status().isUnauthorized());
    }

    // update application
    @Test
    public void updateApplication_shouldReturn200() throws Exception {
        String recruiter_token = registerAndLogin("recruiter");
        Long jobId = createJob(recruiter_token);

        String token = registerAndLogin("applicant");

        Long applicationId = applyToJob(token, jobId);

        mockMvc
            .perform(
                put("/api/applications/" + applicationId)
                    .content(
                        toJson(Map.of("job_id", jobId, "status", "applied"))
                    )
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + recruiter_token)
            )
            .andExpect(status().isOk());
    }

    @Test
    public void updateApplication_shouldReturn401_whenNoAuth()
        throws Exception {
        String recruiter_token = registerAndLogin("recruiter");
        Long jobId = createJob(recruiter_token);

        String token = registerAndLogin("applicant");

        Long applicationId = applyToJob(token, jobId);

        mockMvc
            .perform(
                put("/api/applications/" + applicationId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(toJson(Map.of("status", "applied")))
            )
            .andExpect(status().isUnauthorized());
    }

    // see job applicants

    @Test
    public void seeJobApplicants_shouldReturn200_whenAuth() throws Exception {
        String recruiter_token = registerAndLogin("recruiter");
        Long jobId = createJob(recruiter_token);

        String token = registerAndLogin("applicant");

        applyToJob(token, jobId);

        mockMvc
            .perform(
                get("/api/applications/job/" + jobId).header(
                    "Authorization",
                    "Bearer " + recruiter_token
                )
            )
            .andExpect(status().isOk());
    }

    @Test
    public void seeJobApplicants_shouldReturn_401_whenNoAuth()
        throws Exception {
        String recruiter_token = registerAndLogin("recruiter");
        Long jobId = createJob(recruiter_token);

        mockMvc
            .perform(get("/api/applications/job/" + jobId))
            .andExpect(status().isUnauthorized());
    }
}

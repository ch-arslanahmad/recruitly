package com.recruitly.backend.controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
public class SavedJobControllerTest extends BaseControllerTest {

    @Autowired
    MockMvc mockMvc;

    // save a job
    @Test
    public void saveJob_shouldReturn200_whenAuthenticated() throws Exception {
        String token = registerAndLogin("recruiter");
        Long jobId = createJob(token); // create job by recruiter

        String token_applicant = registerAndLogin("applicant");

        mockMvc
            .perform(
                post("/api/saved-jobs/" + jobId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token_applicant)
            )
            .andExpect(status().isOk());
    }

    @Test
    public void saveJob_shouldReturn403_whenUnauthenticated() throws Exception {
        mockMvc
            .perform(
                post("/api/saved-jobs/1").contentType(
                    MediaType.APPLICATION_JSON
                )
            )
            .andExpect(status().isUnauthorized());
    }

    @Test
    public void saveJob_shouldReturn404_whenJobNotFound() throws Exception {
        String token_applicant = registerAndLogin("applicant");

        mockMvc
            .perform(
                post("/api/saved-jobs/999")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token_applicant)
            )
            .andExpect(status().isNotFound());
    }

    @Test
    public void saveJob_shouldReturn403_whenRecruiterTriesToSave()
        throws Exception {
        String token_recruiter = registerAndLogin("recruiter");
        Long jobId = createJob(token_recruiter);

        mockMvc
            .perform(
                post("/api/saved-jobs/" + jobId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token_recruiter)
            )
            .andExpect(status().isForbidden());
    }

    @Test
    public void saveJob_shouldReturn409_whenSavedJobAlreadyExists()
        throws Exception {
        String token_recruiter = registerAndLogin("recruiter");
        Long jobId = createJob(token_recruiter);

        String token_applicant = registerAndLogin("applicant");

        // save a job
        mockMvc.perform(
            post("/api/saved-jobs/" + jobId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token_applicant)
        );

        // resave it for error

        mockMvc
            .perform(
                post("/api/saved-jobs/" + jobId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token_applicant)
            )
            .andExpect(status().isConflict());
    }

    // get saved job
    @Test
    public void getSavedJob_shouldReturn200_whenAuthenticated()
        throws Exception {
        String token_recruiter = registerAndLogin("recruiter");
        Long jobId = createJob(token_recruiter);

        String token_applicant = registerAndLogin("applicant");

        // save a job for reference
        mockMvc.perform(
            post("/api/saved-jobs/" + jobId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token_applicant)
        );

        // get saved jobs
        mockMvc
            .perform(
                get("/api/saved-jobs")
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token_applicant)
            )
            .andExpect(status().isOk());
    }

    // get saved job should return 401 when unauthenticated
    @Test
    public void getSavedJob_shouldReturn401_whenUnauthenticated()
        throws Exception {
        mockMvc
            .perform(
                get("/api/saved-jobs").contentType(MediaType.APPLICATION_JSON)
            )
            .andExpect(status().isUnauthorized());
    }

    // unsave a job
    @Test
    public void unsaveJob_shouldReturn200_whenAuthenticated() throws Exception {
        String token_recruiter = registerAndLogin("recruiter");
        Long jobId = createJob(token_recruiter);

        String token_applicant = registerAndLogin("applicant");

        // save a job for reference
        mockMvc.perform(
            post("/api/saved-jobs/" + jobId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token_applicant)
        );

        // unsave the job
        mockMvc
            .perform(
                delete("/api/saved-jobs/" + jobId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token_applicant)
            )
            .andExpect(status().isOk());
    }

    // unsave a job should return 401 when unauthenticated
    @Test
    public void unsaveJob_shouldReturn401_whenUnauthenticated()
        throws Exception {
        String token_recruiter = registerAndLogin("recruiter");
        Long jobId = createJob(token_recruiter);

        mockMvc
            .perform(
                delete("/api/saved-jobs/" + jobId).contentType(
                    MediaType.APPLICATION_JSON
                )
            )
            .andExpect(status().isUnauthorized());
    }

    // check if job is saved
    @Test
    public void isJobSaved_shouldReturnTrue_whenJobIsSaved() throws Exception {
        String token_recruiter = registerAndLogin("recruiter");
        Long jobId = createJob(token_recruiter);

        String token_applicant = registerAndLogin("applicant");

        // save the job first
        mockMvc.perform(
            post("/api/saved-jobs/" + jobId)
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + token_applicant)
        );

        // check if saved
        mockMvc
            .perform(
                get("/api/saved-jobs/check/" + jobId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + token_applicant)
            )
            .andExpect(status().isOk());
    }
}

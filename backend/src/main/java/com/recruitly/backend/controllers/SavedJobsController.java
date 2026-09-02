package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.UserRepository;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saved-jobs")
public class SavedJobsController {

    public static final Logger logger = LoggerFactory.getLogger(
        SavedJobsController.class
    );

    private final UserRepository userRepo;

    public SavedJobsController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // GET /api/saved-jobs — list saved jobs
    @GetMapping
    public ResponseEntity<?> listSaved(@AuthenticationPrincipal Long userId) {
        try {
            List<Job> savedJobs = userRepo.getSavedJobs(userId);

            return ResponseEntity.ok(savedJobs);
        } catch (Exception e) {
            logger.error("Error listing saved jobs for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to list saved jobs")
            );
        }
    }

    // POST /api/saved-jobs — save job
    @PostMapping("/{jobId}")
    public ResponseEntity<?> saveJob(
        @AuthenticationPrincipal Long userId,
        @PathVariable Long jobId
    ) {
        try {
            boolean alreadySaved = userRepo.isSavedJob(userId, jobId);

            if (alreadySaved) return ResponseEntity.status(
                HttpStatus.CONFLICT
            ).body(Map.of("message", "Job is already saved"));

            boolean isSaved = userRepo.saveJob(userId, jobId);

            if (!isSaved) return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR
            ).body("Unable to save job");

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error saving job: {} for user: {}", jobId, userId, e);
            return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR
            ).build();
        }
    }

    // DELETE /api/saved-jobs/:jobId — unsave job
    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> unsaveJob(
        @AuthenticationPrincipal Long userId,
        @PathVariable Long jobId
    ) {
        try {
            boolean isUnsaved = userRepo.unsaveJob(userId, jobId);

            if (!isUnsaved) return ResponseEntity.status(
                HttpStatus.NOT_FOUND
            ).body(Map.of("message", "Saved job not found"));

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error(
                "Error unsaving job: {} for user: {}",
                jobId,
                userId,
                e
            );
            return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR
            ).build();
        }
    }

    // GET /api/saved-jobs/check/:jobId — check if saved
    @GetMapping("/check/{jobId}")
    public ResponseEntity<?> checkSaved(
        @AuthenticationPrincipal Long userId,
        @PathVariable Long jobId
    ) {
        try {
            boolean isSaved = userRepo.isSavedJob(userId, jobId);

            return ResponseEntity.ok(Map.of("isSaved", isSaved));
        } catch (Exception e) {
            logger.error(
                "Error checking saved job: {} for user: {}",
                jobId,
                userId,
                e
            );
            return ResponseEntity.status(
                HttpStatus.INTERNAL_SERVER_ERROR
            ).build();
        }
    }
}

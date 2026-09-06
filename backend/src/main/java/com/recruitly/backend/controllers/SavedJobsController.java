package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.services.SavedJobService;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/saved-jobs")
public class SavedJobsController {

    public static final Logger logger = LoggerFactory.getLogger(
        SavedJobsController.class
    );

    private final SavedJobService savedJobService;

    public SavedJobsController(SavedJobService savedJobService) {
        this.savedJobService = savedJobService;
    }

    // GET /api/saved-jobs — list saved jobs
    @GetMapping
    public ResponseEntity<?> listSaved(@AuthenticationPrincipal Long userId) {
        try {
            List<Job> savedJobs = savedJobService.listSaved(userId);
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
            String message = savedJobService.saveJob(userId, jobId);
            return ResponseEntity.ok(message);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
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
            String message = savedJobService.unsaveJob(userId, jobId);
            return ResponseEntity.ok(message);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
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
            boolean isSaved = savedJobService.isSavedJob(userId, jobId);
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

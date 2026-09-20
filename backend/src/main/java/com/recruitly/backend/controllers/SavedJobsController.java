package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.services.SavedJobService;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<List<Job>> listSaved(@AuthenticationPrincipal Long userId) {
        List<Job> savedJobs = savedJobService.listSaved(userId);
        return ResponseEntity.ok(savedJobs);
    }

    // POST /api/saved-jobs/:jobId — save job
    @PostMapping("/{jobId}")
    public ResponseEntity<?> saveJob(
        @AuthenticationPrincipal Long userId,
        @PathVariable Long jobId
    ) {
        String message = savedJobService.saveJob(userId, jobId);
        return ResponseEntity.ok(Map.of("message", message));
    }

    // DELETE /api/saved-jobs/:jobId — unsave job
    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> unsaveJob(
        @AuthenticationPrincipal Long userId,
        @PathVariable Long jobId
    ) {
        String message = savedJobService.unsaveJob(userId, jobId);
        return ResponseEntity.ok(Map.of("message", message));
    }

    // GET /api/saved-jobs/check/:jobId — check if saved
    @GetMapping("/check/{jobId}")
    public ResponseEntity<?> checkSaved(
        @AuthenticationPrincipal Long userId,
        @PathVariable Long jobId
    ) {
        boolean isSaved = savedJobService.isSavedJob(userId, jobId);
        return ResponseEntity.ok(Map.of("isSaved", isSaved));
    }
}

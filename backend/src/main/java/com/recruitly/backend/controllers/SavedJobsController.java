package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.UserRepository;
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

    private final UserRepository userRepo;

    public SavedJobsController(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    // GET /api/saved-jobs — list saved jobs
    @GetMapping
    public ResponseEntity<?> listSaved(@AuthenticationPrincipal Long userId) {
        List<Job> savedJobs = userRepo.getSavedJobs(userId);

        if (savedJobs.isEmpty()) return ResponseEntity.noContent().build();

        return ResponseEntity.ok(Map.of("saved_jobs", savedJobs.toString()));
    }

    // POST /api/saved-jobs — save job
    @PostMapping("/{jobId}")
    public ResponseEntity<?> saveJob(
        @AuthenticationPrincipal Long userId,
        @PathVariable Long jobId
    ) {
        boolean isSaved = userRepo.saveJob(userId, jobId);

        if (!isSaved) return ResponseEntity.badRequest().build();

        return ResponseEntity.ok().build();
    }

    // DELETE /api/saved-jobs/:jobId — unsave job
    @DeleteMapping("/{jobId}")
    public ResponseEntity<?> unsaveJob(
        @AuthenticationPrincipal Long userId,
        @PathVariable Long jobId
    ) {
        boolean isUnsaved = userRepo.unsaveJob(userId, jobId);

        if (!isUnsaved) return ResponseEntity.badRequest().build();

        return ResponseEntity.ok().build();
    }

    // GET /api/saved-jobs/check/:jobId — check if saved
    @GetMapping("/check/{jobId}")
    public ResponseEntity<?> checkSaved(
        @AuthenticationPrincipal Long userId,
        @PathVariable Long jobId
    ) {
        boolean isSaved = userRepo.isSavedJob(userId, jobId);

        if (!isSaved) return ResponseEntity.noContent().build();

        return ResponseEntity.ok().build();
    }
}

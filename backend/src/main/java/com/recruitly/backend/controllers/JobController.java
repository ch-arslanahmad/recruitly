package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.JobRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    public static final Logger logger = LoggerFactory.getLogger(JobController.class);

    private final JobRepository jobRepo;

    public JobController(JobRepository jobRepo) {
        this.jobRepo = jobRepo;
    }

    // GET /api/jobs — list all jobs
    @GetMapping
    public ResponseEntity<?> list() {
        try {
            List<Job> jobs = jobRepo.findAll(
                Optional.empty(),
                Optional.empty(),
                Optional.empty(),
                Optional.empty()
            );

            return ResponseEntity.ok(jobs);
        } catch (Exception e) {
            logger.error("Error listing jobs", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to list jobs")
            );
        }
    }

    // GET /api/jobs/my — recruiter's own jobs
    @GetMapping("/my")
    public ResponseEntity<?> myJobs(@AuthenticationPrincipal Long userID) {
        try {
            List<Job> jobs = jobRepo.findByRecruiter(userID);

            return ResponseEntity.ok(Map.of("jobs", jobs));
        } catch (Exception e) {
            logger.error("Error fetching recruiter jobs for user: {}", userID, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to fetch jobs")
            );
        }
    }

    // GET /api/jobs/stats — recruiter dashboard stats
    @GetMapping("/stats")
    
    public ResponseEntity<?> stats(@AuthenticationPrincipal Long userID) {
        try {
            Map<String, Object> repo = jobRepo.stats(userID);
            return ResponseEntity.ok(repo);
        } catch (Exception e) {
            logger.error("Error fetching stats for user: {}", userID, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to fetch stats")
            );
        }
    }

    // GET /api/jobs/:id — single job detail
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        try {
            Optional<Job> job = jobRepo.findById(
                Optional.ofNullable(id),
                Optional.empty()
            );

            if (job.isEmpty()) return ResponseEntity.status(
                HttpStatus.NOT_FOUND
            ).body(Map.of("message", "Job not found"));

            return ResponseEntity.ok(Map.of("job", job.orElse(null)));
        } catch (Exception e) {
            logger.error("Error fetching job: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to fetch job")
            );
        }
    }

    // POST /api/jobs — create job (recruiter)
    @PostMapping
    public ResponseEntity<?> create(
        @AuthenticationPrincipal Long recruiterId,
        @RequestBody Job job
    ) {
        try {
            job.setRecruiterId(recruiterId); // so job linked with recruiter
            boolean savedJob = jobRepo.create(job);

            if (!savedJob) return ResponseEntity.status(
                HttpStatus.SERVICE_UNAVAILABLE
            ).body(Map.of("message", "Failed to create job"));

            return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message", "Job created successfully")
            );
        } catch (Exception e) {
            logger.error("Error creating job for recruiter: {}", recruiterId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to create job")
            );
        }
    }

    // PUT /api/jobs/:id — update job (recruiter)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
        @PathVariable Long id,
        @AuthenticationPrincipal Long recruiterId,
        @RequestBody Job job
    ) {
        try {
            boolean updatedJob = jobRepo.update(id, recruiterId, job);
            if (!updatedJob) return ResponseEntity.status(
                HttpStatus.NOT_FOUND
            ).body(Map.of("message", "Failed to update job"));

            return ResponseEntity.ok(Map.of("message", "Job updated successfully"));
        } catch (Exception e) {
            logger.error("Error updating job: {} by recruiter: {}", id, recruiterId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to update job")
            );
        }
    }

    // DELETE /api/jobs/:id — delete job (recruiter)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
        @PathVariable Long id,
        @AuthenticationPrincipal Long recruiterId
    ) {
        try {
            boolean isDeleted = jobRepo.delete(id, recruiterId);

            if (!isDeleted) return ResponseEntity.status(
                HttpStatus.NOT_FOUND
            ).body(Map.of("message", "Failed to delete job"));

            return ResponseEntity.ok(
                Map.of("message", "Job deleted successfully")
            );
        } catch (Exception e) {
            logger.error("Error deleting job: {} by recruiter: {}", id, recruiterId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to delete job")
            );
        }
    }
}

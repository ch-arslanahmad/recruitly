package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.JobRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository jobRepo;

    public JobController(JobRepository jobRepo) {
        this.jobRepo = jobRepo;
    }

    // GET /api/jobs — list all jobs
    @GetMapping
    public ResponseEntity<?> list() {
        List<Job> jobs = jobRepo.findAll(
            Optional.empty(),
            Optional.empty(),
            Optional.empty(),
            Optional.empty()
        );

        return ResponseEntity.ok(Map.of("jobs", jobs));
    }

    // GET /api/jobs/my — recruiter's own jobs
    @GetMapping("/my")
    public ResponseEntity<?> myJobs(@AuthenticationPrincipal Long userID) {
        List<Job> jobs = jobRepo.findByRecruiter(userID);

        if (jobs.isEmpty()) return ResponseEntity.status(
            HttpStatus.NOT_FOUND
        ).body(Map.of("message", "No jobs found"));

        return ResponseEntity.ok(Map.of("jobs", jobs));
    }

    // GET /api/jobs/stats — recruiter dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<?> stats(@AuthenticationPrincipal Long userID) {
        Map<String, Object> repo = jobRepo.stats(userID);
        return ResponseEntity.ok(Map.of("stats", repo));
    }

    // GET /api/jobs/:id — single job detail
    @GetMapping("/{id}")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        Optional<Job> job = jobRepo.findById(
            Optional.ofNullable(id),
            Optional.empty()
        );

        if (job.isEmpty()) return ResponseEntity.status(
            HttpStatus.NOT_FOUND
        ).body(Map.of("message", "Job not found"));

        return ResponseEntity.ok(Map.of("job", job.orElse(null)));
    }

    // POST /api/jobs — create job (recruiter)
    @PostMapping
    public ResponseEntity<?> create(
        @AuthenticationPrincipal Long recruiterId,
        @RequestBody Job job
    ) {
        job.setRecruiterId(recruiterId); // so job linked with recruiter
        boolean savedJob = jobRepo.create(job);
        if (!savedJob) return ResponseEntity.status(
            HttpStatus.INTERNAL_SERVER_ERROR
        ).body(Map.of("message", "Failed to create job"));

        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of("message", "Job created successfully")
        );
    }

    // PUT /api/jobs/:id — update job (recruiter)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
        @AuthenticationPrincipal Long id,
        @RequestBody Job job
    ) {
        boolean updatedJob = jobRepo.update(id, job);
        if (!updatedJob) return ResponseEntity.status(
            HttpStatus.INTERNAL_SERVER_ERROR
        ).body(Map.of("message", "Failed to update job"));

        return ResponseEntity.ok(Map.of("message", "Job updated successfully"));
    }

    // DELETE /api/jobs/:id — delete job (recruiter)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal Long id) {
        boolean isDeleted = jobRepo.delete(id);

        if (!isDeleted) return ResponseEntity.status(
            HttpStatus.INTERNAL_SERVER_ERROR
        ).body(Map.of("message", "Failed to delete job"));

        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }
}

package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Application;
import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.ApplicationRepository;
import com.recruitly.backend.repository.ApplicationRepository.ApplicationWithCandidate;
import com.recruitly.backend.repository.ApplicationRepository.ApplicationWithJob;
import com.recruitly.backend.repository.ApplicationRepository.Filter;
import com.recruitly.backend.repository.ApplicationRepository.JobApplicant;
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
@RequestMapping("/api/applications")
public class ApplicationController {

    public static final Logger logger = LoggerFactory.getLogger(
        ApplicationController.class
    );

    private final ApplicationRepository appRepo;
    private final JobRepository jobRepo;

    public ApplicationController(
        ApplicationRepository appRepo,
        JobRepository jobRepo
    ) {
        this.appRepo = appRepo;
        this.jobRepo = jobRepo;
    }

    // POST /api/applications — apply to job (applicant)
    @PostMapping
    public ResponseEntity<?> apply(
        @AuthenticationPrincipal Long candidateID,
        @RequestBody Application app
    ) {
        // fetch the job by ID
        Optional<Job> job = jobRepo.findById(
            Optional.of(app.getJobId()),
            Optional.empty()
        ); // fetch the job by ID

        // error if job does not exist
        if (job.isEmpty() || job == null) {
            return ResponseEntity.notFound().build();
        }

        // error if job is closed
        if (job.get().getStatus() == Job.Status.CLOSED) {
            return ResponseEntity.badRequest().body("This job is closed");
        }

        try {
            app.setCandidateId(candidateID);

            boolean alreadyApplied = appRepo
                .find(
                    new Filter(
                        Optional.empty(),
                        Optional.of(job.get().getId()),
                        Optional.empty(),
                        Optional.empty()
                    )
                )
                .stream()
                .anyMatch(oldApp ->
                    oldApp.getCandidateId().equals(candidateID)
                ); // returns true if the candidate has already applied

            if (alreadyApplied) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    "You have already applied to this job"
                );
            }

            boolean isCreated = appRepo.create(app);

            if (!isCreated) {
                return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR
                ).body("Failed to apply");
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(
                "Applied successfully"
            );
        } catch (Exception e) {
            logger.error(
                "Error applying to job for candidate: {}",
                candidateID,
                e
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                "Failed to apply"
            );
        }
    }

    // GET /api/applications/my — applicant's own applications
    @GetMapping("/my")
    public ResponseEntity<?> myApplications(
        @AuthenticationPrincipal Long candidateId
    ) {
        try {
            List<ApplicationWithJob> app = appRepo.findByCandidateWithJobs(
                candidateId
            );

            return ResponseEntity.ok(app);
        } catch (Exception e) {
            logger.error(
                "Error fetching applications for candidate: {}",
                candidateId,
                e
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to fetch applications")
            );
        }
    }

    // GET /api/applications/applicants — recruiter's applicants
    @GetMapping("/applicants")
    public ResponseEntity<?> myApplicants(
        @AuthenticationPrincipal Long recruiterID
    ) {
        try {
            List<ApplicationWithCandidate> apps = appRepo.findByRecruiter(
                recruiterID
            );

            return ResponseEntity.ok(apps);
        } catch (Exception e) {
            logger.error(
                "Error fetching applicants for recruiter: {}",
                recruiterID,
                e
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to fetch applicants")
            );
        }
    }

    // GET /api/applications/job/:id — applicants for a job (recruiter)
    @GetMapping("/job/{id}")
    public ResponseEntity<?> jobApplications(
        @AuthenticationPrincipal Long recruiterId,
        @PathVariable Long JobId
    ) {
        try {
            List<JobApplicant> apps = appRepo.findJobApplicants(
                JobId,
                recruiterId
            );

            return ResponseEntity.ok(apps);
        } catch (Exception e) {
            logger.error(
                "Error fetching applicants for job: {} by recruiter: {}",
                recruiterId +
                    "\nJobID: " +
                    JobId +
                    "\nMessage: " +
                    e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of("message", "Failed to fetch applicants")
            );
        }
    }

    // PUT /api/applications/:id — update anything (recruiter)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
        @AuthenticationPrincipal Long recruiterId,
        @RequestBody Application body,
        @PathVariable Long id
    ) {
        try {
            if (body == null) {
                return ResponseEntity.badRequest().body("Body is required");
            }

            boolean isUpdated = appRepo.update(id, recruiterId, body);

            if (!isUpdated) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    "Failed to update status"
                );
            }

            return ResponseEntity.ok("Status updated successfully");
        } catch (Exception e) {
            logger.error(
                "Error updating application: {} by recruiter: {}",
                id,
                recruiterId,
                e
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                "Failed to update status"
            );
        }
    }
}

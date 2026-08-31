package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Application;
import com.recruitly.backend.repository.ApplicationRepository;
import com.recruitly.backend.repository.ApplicationRepository.ApplicationWithCandidate;
import com.recruitly.backend.repository.ApplicationRepository.ApplicationWithJob;
import com.recruitly.backend.repository.ApplicationRepository.JobApplicant;
import java.util.List;
import java.util.Map;
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

    public ApplicationController(ApplicationRepository appRepo) {
        this.appRepo = appRepo;
    }

    // POST /api/applications — apply to job (applicant)
    @PostMapping
    public ResponseEntity<?> apply(
        @AuthenticationPrincipal Long candidateID,
        @RequestBody Application app
    ) {
        try {
            app.setCandidateId(candidateID);

            boolean isCreated = appRepo.create(app);

            if (!isCreated) {
                return ResponseEntity.badRequest().body("Failed to apply");
            }

            return ResponseEntity.ok("Applied successfully");
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
                return ResponseEntity.badRequest().body(
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

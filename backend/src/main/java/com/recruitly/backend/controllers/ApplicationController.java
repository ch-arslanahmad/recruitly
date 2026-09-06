package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Application;
import com.recruitly.backend.repository.ApplicationRepository.ApplicationWithCandidate;
import com.recruitly.backend.repository.ApplicationRepository.ApplicationWithJob;
import com.recruitly.backend.repository.ApplicationRepository.JobApplicant;
import com.recruitly.backend.services.ApplicationService;
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
@RequestMapping("/api/applications")
public class ApplicationController {

    public static final Logger logger = LoggerFactory.getLogger(
        ApplicationController.class
    );

    private final ApplicationService appService;

    public ApplicationController(ApplicationService appService) {
        this.appService = appService;
    }

    // POST /api/applications — apply to job (applicant)
    @PostMapping
    public ResponseEntity<?> apply(
        @AuthenticationPrincipal Long candidateID,
        @RequestBody Application app
    ) {
        try {
            String message = appService.apply(candidateID, app);
            return ResponseEntity.status(HttpStatus.CREATED).body(message);
        } catch (ResponseStatusException e) {
            logger.warn(
                "Application error for candidate: {} — {} {}",
                candidateID,
                e.getStatusCode(),
                e.getReason()
            );
            throw e;
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
            List<ApplicationWithJob> apps = appService.findByCandidateWithJobs(
                candidateId
            );
            return ResponseEntity.ok(apps);
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
            List<ApplicationWithCandidate> apps = appService.findByRecruiter(
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
            List<JobApplicant> apps = appService.findJobApplicants(
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
            String message = appService.update(id, recruiterId, body);
            return ResponseEntity.ok(message);
        } catch (ResponseStatusException e) {
            logger.warn(
                "Application error for candidate: {} — {} {}",
                id,
                e.getStatusCode(),
                e.getReason()
            );
            throw e;
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

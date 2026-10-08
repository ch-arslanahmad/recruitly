package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Application;
import com.recruitly.backend.repository.ApplicationRepository.ApplicationWithCandidate;
import com.recruitly.backend.repository.ApplicationRepository.ApplicationWithJob;
import com.recruitly.backend.repository.ApplicationRepository.JobApplicant;
import com.recruitly.backend.services.ApplicationService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService appService;

    public ApplicationController(ApplicationService appService) {
        this.appService = appService;
    }

    // POST /api/applications — apply to job (applicant)
    @PostMapping
    public ResponseEntity<?> apply(
        @AuthenticationPrincipal Long candidateID,
        @Valid @RequestBody Application app
    ) {
        Long appId = appService.apply(candidateID, app);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            Map.of("message", "Applied successfully", "id", appId)
        );
    }

    // GET /api/applications/my — applicant's own applications
    @GetMapping("/my")
    public ResponseEntity<List<ApplicationWithJob>> myApplications(
        @AuthenticationPrincipal Long candidateId
    ) {
        List<ApplicationWithJob> apps = appService.findByCandidateWithJobs(
            candidateId
        );
        return ResponseEntity.ok(apps);
    }

    // GET /api/applications/applicants — recruiter's applicants
    @GetMapping("/applicants")
    public ResponseEntity<List<ApplicationWithCandidate>> myApplicants(
        @AuthenticationPrincipal Long recruiterID
    ) {
        List<ApplicationWithCandidate> apps = appService.findByRecruiter(
            recruiterID
        );
        return ResponseEntity.ok(apps);
    }

    // GET /api/applications/job/:id — applicants for a job (recruiter)
    @GetMapping("/job/{id}")
    public ResponseEntity<List<JobApplicant>> jobApplications(
        @AuthenticationPrincipal Long recruiterId,
        @PathVariable("id") Long jobId
    ) {
        List<JobApplicant> apps = appService.findJobApplicants(
            jobId,
            recruiterId
        );
        return ResponseEntity.ok(apps);
    }

    // PUT /api/applications/:id — update application status (recruiter)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
        @AuthenticationPrincipal Long recruiterId,
        @Valid @RequestBody Application body,
        @PathVariable Long id
    ) {
        if (body.getStatus() == null) {
            return ResponseEntity.badRequest().body(
                Map.of("message", "Status is required")
            );
        }

        String message = appService.update(id, recruiterId, body);
        return ResponseEntity.ok(Map.of("message", message));
    }
}

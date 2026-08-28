package com.recruitly.backend.controllers;

import com.recruitly.backend.model.Application;
import com.recruitly.backend.repository.ApplicationRepository;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

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
        app.setCandidateId(candidateID);

        boolean isCreated = appRepo.create(app);

        if (!isCreated) {
            return ResponseEntity.badRequest().body("Failed to apply");
        }

        return ResponseEntity.ok("Applied successfully");
    }

    // GET /api/applications/my — applicant's own applications
    @GetMapping("/my")
    public ResponseEntity<?> myApplications(
        @AuthenticationPrincipal Long candidateId
    ) {
        List<Application> app = appRepo.find(
            new ApplicationRepository.Filter(null, null, candidateId, null)
        );

        if (app.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(Map.of("app", app));
    }

    // GET /api/applications/applicants — recruiter's applicants
    @GetMapping("/applicants")
    public ResponseEntity<?> myApplicants(
        @AuthenticationPrincipal Long userId
    ) {
        List<Application> apps = appRepo.find(
            new ApplicationRepository.Filter(null, null, null, userId)
        );

        if (apps.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(Map.of("apps", apps));
    }

    // GET /api/applications/job/:id — applicants for a job (recruiter)
    @GetMapping("/job/{id}")
    public ResponseEntity<?> jobApplications(@PathVariable Long id) {
        List<Application> apps = appRepo.find(
            new ApplicationRepository.Filter(id, null, null, null)
        );

        if (apps.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(Map.of("apps", apps));
    }

    // PUT /api/applications/:id — update anything (recruiter)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
        @RequestBody Application body,
        @PathVariable Long id
    ) {
        if (body == null) {
            return ResponseEntity.badRequest().body("Body is required");
        }

        boolean isUpdated = appRepo.update(id, body);

        if (!isUpdated) {
            return ResponseEntity.badRequest().body("Failed to update status");
        }

        return ResponseEntity.ok("Status updated successfully");
    }
}

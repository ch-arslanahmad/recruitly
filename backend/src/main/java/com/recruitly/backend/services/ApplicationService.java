package com.recruitly.backend.services;

import com.recruitly.backend.model.Application;
import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.ApplicationRepository;
import com.recruitly.backend.repository.ApplicationRepository.ApplicationWithCandidate;
import com.recruitly.backend.repository.ApplicationRepository.ApplicationWithJob;
import com.recruitly.backend.repository.ApplicationRepository.Filter;
import com.recruitly.backend.repository.ApplicationRepository.JobApplicant;
import com.recruitly.backend.repository.JobRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.yaml.snakeyaml.constructor.DuplicateKeyException;

@Service
public class ApplicationService {

    private final JobRepository jobRepo;
    private final ApplicationRepository appRepo;

    public ApplicationService(
        JobRepository jobRepo,
        ApplicationRepository appRepo
    ) {
        this.jobRepo = jobRepo;
        this.appRepo = appRepo;
    }

    public Long apply(Long candidateID, Application app) {
        // fetch the job by ID
        Optional<Job> job = jobRepo.findById(app.getJobId(), Optional.empty()); // fetch the job by ID

        // error if job does not exist
        if (job.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Job not found"
            );
        }

        // error if job is closed
        if (job.get().getStatus() == Job.Status.CLOSED) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "This job is closed"
            );
        }

        app.setCandidateId(candidateID);

        boolean alreadyApplied = appRepo
            .find(
                null,
                new Filter(
                    Optional.empty(),
                    Optional.of(app.getJobId()),
                    Optional.of(candidateID)
                )
            )
            .stream()
            .anyMatch(oldApp -> oldApp.getCandidateId().equals(candidateID)); // returns true if the candidate has already applied

        if (alreadyApplied) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "You have already applied to this job"
            );
        }

        try {
            boolean isCreated = appRepo.create(app);
            if (!isCreated) {
                throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to apply"
                );
            }
        } catch (DuplicateKeyException e) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "You have already applied to this job"
            );
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Failed to apply"
            );
        }

        return app.getId();
    }

    public String update(Long id, Long recruiterId, Application body) {
        if (body == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Body is required"
            );
        }

        Application current = appRepo
            .find(
                null,
                new Filter(Optional.of(id), Optional.empty(), Optional.empty())
            )
            .stream()
            .findFirst()
            .orElse(null);

        if (current == null) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Application not found"
            );
        }

        Job application_job = jobRepo
            .findById(current.getJobId(), Optional.empty())
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Job not found"
                )
            );

        // Cross-recruiter update
        if (!application_job.getRecruiterId().equals(recruiterId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You are not authorized to update this application"
            );
        }

        if (!current.allowTransition(body.getStatus())) {
            if (
                body.getStatus().toString().equals("HIRED") ||
                body.getStatus().toString().equals("REJECTED")
            ) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot change status from " +
                        current.getStatus() +
                        " to " +
                        body.getStatus() +
                        ".\n" +
                        body.getStatus() +
                        " is the final status."
                );
            }

            if (
                current.getStatus().toString().equals("APPLIED") &&
                body.getStatus().toString().equals("HIRED")
            ) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Cannot change status from " +
                        current.getStatus() +
                        " to " +
                        body.getStatus() +
                        ".\n" +
                        "Must go through the 'SHORTLISTED' first."
                );
            }

            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Cannot change status from " +
                    current.getStatus() +
                    " to " +
                    body.getStatus()
            );
        }

        boolean isUpdated = appRepo.update(id, recruiterId, body);

        if (!isUpdated) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Failed to update status"
            );
        }

        return "Successfully updated status";
    }

    public List<ApplicationWithJob> findByCandidateWithJobs(Long candidateID) {
        return appRepo.findByCandidateWithJobs(candidateID);
    }

    public List<ApplicationWithCandidate> findByRecruiter(Long candidateID) {
        return appRepo.findByRecruiter(candidateID);
    }

    public List<JobApplicant> findJobApplicants(Long jobId, Long recruiterID) {
        Job job = jobRepo
            .findById(jobId, Optional.empty())
            .orElseThrow(() ->
                new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Job not found"
                )
            );

        if (!job.getRecruiterId().equals(recruiterID)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You are not authorized to view this job"
            );
        }

        return appRepo.findJobApplicants(jobId, recruiterID);
    }
}

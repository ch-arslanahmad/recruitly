package com.recruitly.backend.services;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.JobRepository;
import com.recruitly.backend.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SavedJobService {

    private final UserRepository userRepo;

    private final JobRepository jobRepo;

    public SavedJobService(UserRepository userRepo, JobRepository jobRepo) {
        this.userRepo = userRepo;
        this.jobRepo = jobRepo;
    }

    public List<Job> listSaved(Long userId) {
        return userRepo.getSavedJobs(userId);
    }

    public String saveJob(Long userId, Long jobId) {
        Optional<Job> job = jobRepo.findById(
            Optional.of(jobId),
            Optional.empty()
        );

        if (job.isEmpty()) throw new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Job not found"
        );

        boolean alreadySaved = userRepo.isSavedJob(userId, jobId);

        if (alreadySaved) throw new ResponseStatusException(
            HttpStatus.CONFLICT,
            "You have already saved this job"
        );

        boolean isSaved = userRepo.saveJob(userId, jobId);

        if (!isSaved) throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Unable to save job"
        );

        return "Successfully saved job";
    }

    public String unsaveJob(Long userId, Long jobId) {
        boolean isUnsaved = userRepo.unsaveJob(userId, jobId);

        if (!isUnsaved) throw new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Unable to unsave job"
        );

        return "Successfully unsaved job";
    }

    public boolean isSavedJob(Long userId, Long jobId) {
        return userRepo.isSavedJob(userId, jobId);
    }
}

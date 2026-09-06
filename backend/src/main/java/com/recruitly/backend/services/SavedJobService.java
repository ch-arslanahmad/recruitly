package com.recruitly.backend.services;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.UserRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class SavedJobService {

    private final UserRepository userRepo;

    public SavedJobService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public List<Job> listSaved(Long userId) {
        return userRepo.getSavedJobs(userId);
    }

    public String saveJob(Long userId, Long jobId) {
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

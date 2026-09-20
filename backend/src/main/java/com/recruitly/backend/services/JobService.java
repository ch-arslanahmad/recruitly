package com.recruitly.backend.services;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.repository.JobRepository;
import com.recruitly.backend.repository.JobRepository.JobFilter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class JobService {

    private final JobRepository jobRepo;

    public JobService(JobRepository jobRepo) {
        this.jobRepo = jobRepo;
    }

    public boolean create(Job job) {
        Optional<Job> existingJob = jobRepo.findById(
            job.getId(),
            Optional.empty()
        );

        if (existingJob.isPresent()) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Job already exists"
            );
        }

        // recruiter id must be specified
        if (job.getRecruiterId() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Recruiter id must be specified"
            );
        }

        jobRepo.create(job);
        return true;
    }

    public boolean update(Long jobId, Long recruiterId, Job job) {
        Optional<Job> existingJob = jobRepo.findById(jobId, Optional.empty());

        // recruiter id must be specified
        if (recruiterId == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Recruiter id must be specified"
            );
        }

        // the job must EXIST to update
        if (existingJob.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Job not found"
            );
        }

        // the recruiter id must match the existing job
        if (!existingJob.get().getRecruiterId().equals(recruiterId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Recruiter id does not match"
            );
        }

        jobRepo.update(jobId, recruiterId, job);
        return true;
    }

    public boolean delete(Long jobId, Long recruiterId) {
        Optional<Job> existingJob = jobRepo.findById(jobId, Optional.empty());

        if (existingJob.isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Job not found"
            );
        }

        if (!existingJob.get().getRecruiterId().equals(recruiterId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Recruiter id does not match"
            );
        }

        jobRepo.delete(jobId, recruiterId);
        return true;
    }

    // single job by id
    public Optional<Job> findById(Long jobId) {
        return jobRepo.findById(jobId, Optional.empty());
    }

    public List<Job> list(
        Optional<Long> recruiterId,
        Optional<JobFilter> filter
    ) {
        if (filter.isEmpty()) {
            return jobRepo.findAll(recruiterId, Optional.empty());
        }
        return jobRepo.findAll(
            recruiterId,
            Optional.of(
                new JobFilter(
                    filter.get().type(),
                    filter.get().location(),
                    filter.get().minSalary()
                )
            )
        );
    }

    // jobs posted by a recruiter
    public List<Job> myJobs(Long recruiterId) {
        return jobRepo.findAll(
            Optional.of(recruiterId),
            Optional.<JobFilter>empty()
        );
    }

    // stats for a recruiter
    public Map<String, Object> stats(long recruiterId) {
        return jobRepo.stats(recruiterId);
    }
}

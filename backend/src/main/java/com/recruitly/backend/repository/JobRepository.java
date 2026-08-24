package com.recruitly.backend.repository;

import com.recruitly.backend.model.Job;
// logger
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JobRepository {

    private final Logger log = LoggerFactory.getLogger(JobRepository.class);

    private final JdbcTemplate jdbc;

    public JobRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public boolean create(Job job) {
        try {
            jdbc.update(
                "INSERT INTO job (recruiter_id, title, status, about_role, requirements, responsibilities, location, salary, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                job.getRecruiterId(),
                job.getTitle(),
                job.getStatus().toString().toLowerCase(),
                job.getAboutRole(),
                job.getRequirements(),
                job.getResponsibilities(),
                job.getLocation(),
                job.getSalary(),
                job.getType().name().toLowerCase().replace("_", "-")
            );
            return true;
        } catch (Exception e) {
            log.error(
                "Error creating job: " +
                    job.getRecruiterId() +
                    " \n " +
                    e.getMessage()
            );
            return false;
        }
    }
}

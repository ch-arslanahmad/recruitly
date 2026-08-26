package com.recruitly.backend.repository;

import com.recruitly.backend.model.Application;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ApplicationRepository {

    private final Logger log = LoggerFactory.getLogger(
        ApplicationRepository.class
    );

    private final JdbcTemplate jdbc;

    public ApplicationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public boolean create(Application app) {
        String sql =
            "INSERT INTO application (job_id, candidate_id, status) VALUES (?, ?, ?)";
        try {
            jdbc.update(
                sql,
                app.getJobId(),
                app.getCandidateId(),
                app.getStatus().toString().toLowerCase()
            );
            return true;
        } catch (Exception e) {
            log.debug("Error creating the Application", e.getMessage());
            return false;
        }
    }

    record Filter(Long id, Long jobId, Long candidateId, Long recruiterId) {}

    public Optional<Application> find(Filter filter) {
        String sql = "SELECT * FROM application WHERE 1=1";
        List<String> conditions = new ArrayList<>();
        List<Object> args = new ArrayList<>();

        if (filter.id() != null) {
            conditions.add("id = ?");
            args.add(filter.id());
        }
        if (filter.jobId() != null) {
            conditions.add("job_id = ?");
            args.add(filter.jobId());
        }
        if (filter.candidateId() != null) {
            conditions.add("candidate_id = ?");
            args.add(filter.candidateId());
        }
        if (filter.recruiterId() != null) {
            conditions.add("job_id IN (SELECT id FROM job WHERE recruiter_id = ?)");
            args.add(filter.recruiterId());
        }

        if (!conditions.isEmpty()) {
            sql += " AND " + String.join(" AND ", conditions);
        }

        try {
            Application app = jdbc.queryForObject(
                sql,
                (rs, rowNum) -> {
                    Application a = new Application();
                    a.setId(rs.getLong("id"));
                    a.setJobId(rs.getLong("job_id"));
                    a.setCandidateId(rs.getLong("candidate_id"));
                    a.setStatus(
                        Application.Status.valueOf(
                            rs.getString("status").toUpperCase()
                        )
                    );
                    return a;
                },
                args.toArray()
            );
            return Optional.ofNullable(app);
        } catch (Exception e) {
            log.debug("Error finding the Application", e.getMessage());
            return Optional.empty();
        }
    }

    record ApplicationWithCandidate(
        Long id,
        Long jobId,
        Long candidateId,
        Application.Status status,
        String jobTitle,
        String location,
        Integer salary,
        String jobType,
        String jobStatus,
        String candidateName
    ) {}

    public List<ApplicationWithCandidate> findByRecruiter(Long recruiterId) {
        String query =
            "SELECT application.id, application.job_id, application.candidate_id, application.status, " +
            "job.title AS job_title, job.location, job.salary, job.type AS job_type, job.status AS job_status, " +
            "user.name AS candidate_name " +
            "FROM application " +
            "JOIN job ON application.job_id = job.id " +
            "JOIN user ON application.candidate_id = user.id " +
            "WHERE job.recruiter_id = ? " +
            "ORDER BY application.created_at DESC";

        try {
            return jdbc.query(
                query,
                (rs, rowNum) -> new ApplicationWithCandidate(
                    rs.getLong("id"),
                    rs.getLong("job_id"),
                    rs.getLong("candidate_id"),
                    Application.Status.valueOf(rs.getString("status").toUpperCase()),
                    rs.getString("job_title"),
                    rs.getString("location"),
                    rs.getInt("salary"),
                    rs.getString("job_type"),
                    rs.getString("job_status"),
                    rs.getString("candidate_name")
                ),
                recruiterId
            );
        } catch (Exception e) {
            log.debug("Error finding applications by recruiter: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    record JobApplicant(
        Long applicationId,
        Long applicantId,
        String candidateName,
        Application.Status status
    ) {}

    public List<JobApplicant> findJobApplicants(Long jobId) {
        String query =
            "SELECT app.id AS application_id, applicant.id AS applicant_id, " +
            "applicant.name AS candidate_name, app.status " +
            "FROM application AS app " +
            "JOIN user AS applicant ON app.candidate_id = applicant.id " +
            "WHERE app.job_id = ? " +
            "ORDER BY app.created_at DESC";

        try {
            return jdbc.query(
                query,
                (rs, rowNum) -> new JobApplicant(
                    rs.getLong("application_id"),
                    rs.getLong("applicant_id"),
                    rs.getString("candidate_name"),
                    Application.Status.valueOf(rs.getString("status").toUpperCase())
                ),
                jobId
            );
        } catch (Exception e) {
            log.debug("Error finding job applicants: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    record ApplicationWithJob(
        Long id,
        Long jobId,
        Long candidateId,
        Application.Status status,
        String jobTitle,
        String location,
        Integer salary,
        String jobType,
        String jobStatus,
        String company
    ) {}

    public List<ApplicationWithJob> findByCandidateWithJobs(Long candidateId) {
        String query =
            "SELECT application.id, application.job_id, application.candidate_id, application.status, " +
            "job.title AS job_title, job.location, job.salary, job.type AS job_type, job.status AS job_status, " +
            "user.company AS company " +
            "FROM application " +
            "JOIN job ON application.job_id = job.id " +
            "JOIN user ON job.recruiter_id = user.id " +
            "WHERE application.candidate_id = ? " +
            "ORDER BY application.created_at DESC";

        try {
            return jdbc.query(
                query,
                (rs, rowNum) -> new ApplicationWithJob(
                    rs.getLong("id"),
                    rs.getLong("job_id"),
                    rs.getLong("candidate_id"),
                    Application.Status.valueOf(rs.getString("status").toUpperCase()),
                    rs.getString("job_title"),
                    rs.getString("location"),
                    rs.getInt("salary"),
                    rs.getString("job_type"),
                    rs.getString("job_status"),
                    rs.getString("company")
                ),
                candidateId
            );
        } catch (Exception e) {
            log.debug("Error finding applications with jobs: " + e.getMessage());
            return new ArrayList<>();
        }
    }

    public boolean updateStatus(Long id, String status) {
        String sql = "UPDATE application SET status = ? WHERE id = ?";
        try {
            int rows = jdbc.update(sql, status, id);
            return rows > 0;
        } catch (Exception e) {
            log.debug("Error updating application status: " + e.getMessage());
            return false;
        }
    }

}

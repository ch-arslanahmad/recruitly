package com.recruitly.backend.repository;

import com.recruitly.backend.model.Job;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
    }

    public Optional<Job> findById(
        Optional<Long> id,
        Optional<Long> recruiterId
    ) {
        String query = "SELECT * FROM job WHERE 1=1 ";

        List<String> params = new ArrayList<>();

        if (id.isPresent()) {
            query += "AND id = ?";
            params.add(id.get().toString());
        }
        if (recruiterId.isPresent()) {
            query += "AND recruiter_id = ?";
            params.add(recruiterId.get().toString());
        }

        List<Job> jobs = jdbc.query(
            query,
            (rs, rowNum) -> {
                Job j = new Job();
                j.setId(rs.getLong("id"));
                j.setRecruiterId(rs.getLong("recruiter_id"));
                j.setTitle(rs.getString("title"));
                j.setStatus(
                    Job.Status.valueOf(rs.getString("status").toUpperCase())
                );
                j.setAboutRole(rs.getString("about_role"));
                j.setRequirements(rs.getString("requirements"));
                j.setResponsibilities(rs.getString("responsibilities"));
                j.setLocation(rs.getString("location"));
                j.setSalary(rs.getInt("salary"));
                j.setType(
                    Job.Type.valueOf(
                        rs.getString("type").toUpperCase().replace("-", "_")
                    )
                );
                return j;
            },
            params.toArray()
        );

        return jobs.stream().findFirst();
    }

    public List<Job> findByRecruiter(Long recruiterID) {
        String query =
            "SELECT job.*, user.company, (SELECT COUNT(*) FROM application WHERE job_id = job.id) AS applicant_count FROM job JOIN user ON job.recruiter_id = user.id WHERE recruiter_id = ? ORDER BY job.created_at DESC";

        List<Job> result = jdbc.query(
            query,
            (rs, rowNum) -> {
                Job job = new Job();
                job.setId(rs.getLong("id"));
                job.setRecruiterId(rs.getLong("recruiter_id"));
                job.setTitle(rs.getString("title"));
                job.setStatus(
                    Job.Status.valueOf(rs.getString("status").toUpperCase())
                );
                job.setAboutRole(rs.getString("about_role"));
                job.setRequirements(rs.getString("requirements"));
                job.setResponsibilities(rs.getString("responsibilities"));
                job.setLocation(rs.getString("location"));
                job.setSalary(rs.getInt("salary"));
                job.setType(
                    Job.Type.valueOf(
                        rs.getString("type").toUpperCase().replace("-", "_")
                    )
                );
                return job;
            },
            recruiterID
        );
        return result;
    }

    public List<Job> findAll(
        Optional<String> type,
        Optional<String> location,
        Optional<Integer> minSalary,
        Optional<Long> recruiterId
    ) {
        String query =
            "SELECT job.*, user.company, (SELECT COUNT(*) FROM application WHERE job_id = job.id) AS applicant_count FROM job JOIN user ON job.recruiter_id = user.id WHERE 1=1 ";

        List<Object> params = new ArrayList<>();

        if (type.isPresent()) {
            query += "AND job.type = ? ";
            params.add(type.get().toLowerCase());
        }
        if (location.isPresent()) {
            query += "AND job.location = ? ";
            params.add(location.get());
        }

        if (minSalary.isPresent()) {
            query += "AND job.salary >= ? ";
            params.add(minSalary.get());
        }

        if (recruiterId.isPresent()) {
            query += "AND job.recruiter_id = ? ";
            params.add(recruiterId.get());
        }

        query += "ORDER BY job.created_at DESC";

        try {
            List<Job> result = jdbc.query(
                query,
                (rs, rowNum) -> {
                    Job job = new Job();
                    job.setId(rs.getLong("id"));
                    job.setRecruiterId(rs.getLong("recruiter_id"));
                    job.setTitle(rs.getString("title"));
                    job.setStatus(
                        Job.Status.valueOf(rs.getString("status").toUpperCase())
                    );
                    job.setAboutRole(rs.getString("about_role"));
                    job.setRequirements(rs.getString("requirements"));
                    job.setResponsibilities(rs.getString("responsibilities"));
                    job.setLocation(rs.getString("location"));
                    job.setSalary(rs.getInt("salary"));
                    job.setType(
                        Job.Type.valueOf(
                            rs.getString("type").toUpperCase().replace("-", "_")
                        )
                    );
                    return job;
                },
                params.toArray()
            );
            return result;
        } catch (Exception e) {
            log.error("Error finding all jobs: {}", e.getMessage(), e);

            return new java.util.ArrayList<Job>();
        }
    }

    public boolean update(Long id, Long recruiterID, Job job) {
        int rows = jdbc.update(
            "UPDATE job SET title = ?, status = ?, about_role = ?, requirements = ?, responsibilities = ?, location = ?, salary = ?, type = ? WHERE id = ? AND recruiter_id = ?",
            job.getTitle(),
            job.getStatus().toString().toLowerCase(),
            job.getAboutRole(),
            job.getRequirements(),
            job.getResponsibilities(),
            job.getLocation(),
            job.getSalary(),
            job.getType().name().toLowerCase().replace("_", "-"),
            id,
            recruiterID
        );
        return rows > 0;
    }

    public boolean delete(Long id, Long recruiterID) {
        int rows = jdbc.update(
            "DELETE FROM job WHERE id = ? AND recruiter_id = ?",
            id,
            recruiterID
        );
        return rows > 0;
    }

    public Map<String, Object> stats(long recruiterId) {
        String query =
            "SELECT (SELECT COUNT(*) FROM job WHERE recruiter_id = ?) AS total_jobs, (SELECT COUNT(*) FROM application WHERE job_id IN (SELECT id FROM job WHERE recruiter_id = ?)) AS total_applications, (SELECT COUNT(*) FROM job WHERE recruiter_id = ? AND created_at >= DATE('now', '-7 days')) AS jobs_last_7_days, (SELECT COUNT(*) FROM application WHERE status = 'interviewing' AND job_id IN (SELECT id FROM job WHERE recruiter_id = ?)) AS total_interviews";

        Map<String, Object> result = jdbc.queryForMap(
            query,
            recruiterId,
            recruiterId,
            recruiterId,
            recruiterId
        );
        log.info("Job stats: {}", result);
        return result;
    }
}

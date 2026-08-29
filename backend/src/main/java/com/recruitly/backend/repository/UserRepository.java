package com.recruitly.backend.repository;

import com.recruitly.backend.model.Job;
import com.recruitly.backend.model.User;
import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private static final Logger log = LoggerFactory.getLogger(
        UserRepository.class
    );

    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public Long create(User user) {
        String sql =
            "INSERT INTO user (name, username, password, role, company, created_at) VALUES (?, ?, ?, ?, ?, ?)";

        try {
            KeyHolder keyHolder = new GeneratedKeyHolder();
            jdbc.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
                );
                ps.setString(1, user.getName());
                ps.setString(2, user.getUsername());
                ps.setString(3, user.getPassword());
                ps.setString(4, user.getRole().name());
                ps.setString(5, user.getCompany());
                ps.setString(6, user.getCreatedAt());
                return ps;
            }, keyHolder);

            Long id = keyHolder.getKey().longValue();
            user.setId(id);
            log.info("Created user: {} (id={})", user.getUsername(), id);
            return id;
        } catch (Exception e) {
            log.error(
                "Error creating user {}: {}",
                user.getUsername(),
                e.getMessage(),
                e
            );
            return null;
        }
    }

    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM user WHERE username = ?";
        try {
            User user = jdbc.queryForObject(sql, new UserMapper(), username);
            return Optional.of(user);
        } catch (Exception e) {
            log.debug("User not found by username: {}", username);
            return Optional.empty();
        }
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM user WHERE id = ?";
        try {
            User user = jdbc.queryForObject(sql, new UserMapper(), id);
            return Optional.of(user);
        } catch (Exception e) {
            log.error("Error finding user by ID: {}", id, e);
            return Optional.empty();
        }
    }

    public List<Job> getSavedJobs(Long userId) {
        String sql = """
        SELECT job.*, user.company AS company, saved_jobs.saved_at AS saved_at
        FROM saved_jobs
        JOIN job ON job.id = saved_jobs.job_id
        JOIN user ON user.id = job.recruiter_id
        WHERE saved_jobs.user_id = ?
        ORDER BY saved_jobs.saved_at DESC
        """;
        try {
            return jdbc.query(
                sql,
                (rs, rownum) -> {
                    Job job = new Job();
                    job.setId(rs.getLong("id"));
                    job.setTitle(rs.getString("title"));
                    job.setStatus(Job.Status.valueOf(rs.getString("status")));
                    job.setAboutRole(rs.getString("about_role"));
                    job.setRequirements(rs.getString("requirements"));
                    job.setResponsibilities(rs.getString("responsibilities"));
                    job.setLocation(rs.getString("location"));
                    job.setSalary(rs.getInt("salary"));
                    job.setType(
                        Job.Type.valueOf(rs.getString("type").replace("-", "_"))
                    );
                    job.setCreatedAt(rs.getString("created_at"));
                    return job;
                },
                userId
            );
        } catch (Exception e) {
            log.error(
                "Error getting Saved Jobs of user: {} - {}",
                userId,
                e.getMessage(),
                e
            );
            return List.of();
        }
    }

    public boolean isSavedJob(Long userId, Long jobId) {
        String sql =
            "SELECT COUNT(*) FROM saved_jobs WHERE user_id = ? AND job_id = ?";
        try {
            Integer count = jdbc.queryForObject(
                sql,
                Integer.class,
                userId,
                jobId
            );
            return count != null && count > 0;
        } catch (Exception e) {
            log.error(
                "Error checking saved job for user {} job {}: {}",
                userId,
                jobId,
                e.getMessage(),
                e
            );
            return false;
        }
    }

    public boolean saveJob(Long userId, Long jobId) {
        String sql = "INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)";
        try {
            jdbc.update(sql, userId, jobId);
            return true;
        } catch (Exception e) {
            log.error(
                "Error saving job {} for user {}: {}",
                jobId,
                userId,
                e.getMessage(),
                e
            );
            return false;
        }
    }

    public boolean unsaveJob(Long userId, Long jobId) {
        String sql = "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?";
        try {
            jdbc.update(sql, userId, jobId);
            return true;
        } catch (Exception e) {
            log.error(
                "Error unsaving job {} for user {}: {}",
                jobId,
                userId,
                e.getMessage(),
                e
            );
            return false;
        }
    }
}

package com.recruitly.backend.repository;

import com.recruitly.backend.model.User;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
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

    public boolean create(User user) {
        String sql =
            "INSERT INTO user (name, username, password, role, company, created_at) VALUES (?, ?, ?, ?, ?, ?)";

        int rows = jdbc.update(
            sql,
            user.getName(),
            user.getUsername(),
            user.getPassword(),
            user.getRole().name(),
            user.getCompany(),
            user.getCreatedAt()
        );

        return rows > 0;
    }

    public Optional<User> findByUsername(String username) {
        String sql = "SELECT * FROM user WHERE username = ?";
        try {
            User user = jdbc.queryForObject(sql, new UserMapper(), username);
            return Optional.of(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM user WHERE id = ?";
        try {
            User user = jdbc.queryForObject(sql, new UserMapper(), id);
            return Optional.of(user);
        } catch (Exception e) {
            log.error("Error finding user by ID: " + id, "\n" + e.getMessage());
            return Optional.empty();
        }
    }

    public List<Map<String, Object>> getSavedJobs(Long userId) {
        String sql = """
        SELECT job.*, user.company AS company, saved_jobs.saved_at AS saved_at
        FROM saved_jobs
        JOIN job ON job.id = saved_jobs.job_id
        JOIN user ON user.id = job.recruiter_id
        WHERE saved_jobs.user_id = ?
        ORDER BY saved_jobs.saved_at DESC
        """;
        try {
            return jdbc.queryForList(sql, userId);
        } catch (Exception e) {
            log.error(
                "Error getting Saved Jobs of user: " +
                    userId +
                    "\nError: " +
                    e.getMessage()
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
            return false;
        }
    }

    public void saveJob(Long userId, Long jobId) {
        String sql = "INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)";
        try {
            jdbc.update(sql, userId, jobId);
        } catch (Exception e) {
            // log error silently
        }
    }

    public void unsaveJob(Long userId, Long jobId) {
        String sql = "DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?";
        try {
            jdbc.update(sql, userId, jobId);
        } catch (Exception e) {
            // log error silently
        }
    }
}

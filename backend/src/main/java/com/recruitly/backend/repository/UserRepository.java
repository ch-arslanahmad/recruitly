package com.recruitly.backend.repository;

import com.recruitly.backend.model.User;
import com.recruitly.backend.model.User.Role;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void create(User user) {
        String sql =
            "INSERT INTO user (name, username, password, role, company, created_at) VALUES (?, ?, ?, ?, ?, ?)";

        jdbc.update(
            sql,
            user.getName(),
            user.getUsername(),
            user.getPassword(),
            user.getRole().name(), // enum → string ("recruiter")
            user.getCompany(),
            user.getCreatedAt()
        );
    }

    public Optional<User> findById(Long id) {
        String sql = "SELECT * FROM user WHERE id = ?";
        List<User> results = jdbc.query(sql, new UserMapper(), id);

        return results.isEmpty()
            ? Optional.empty()
            : Optional.of(results.get(0));
    }
}

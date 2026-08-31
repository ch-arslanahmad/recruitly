package com.recruitly.backend.repository;

import com.recruitly.backend.model.User;
import com.recruitly.backend.model.User.Role;
import java.sql.ResultSet;
import java.sql.SQLException;
import org.springframework.jdbc.core.RowMapper;

public class UserMapper implements RowMapper<User> {

    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setName(rs.getString("name"));
        user.setUsername(rs.getString("username"));
        user.setPassword(rs.getString("password"));
        user.setRole(Role.valueOf(rs.getString("role"))); // string → enum
        user.setCompany(rs.getString("company"));
        user.setCreatedAt(rs.getString("created_at"));
        return user;
    }
}

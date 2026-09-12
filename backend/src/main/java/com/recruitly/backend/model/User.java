package com.recruitly.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.HashMap;
import java.util.Map;
import lombok.Data;

@Data
public class User {

    public enum Role {
        recruiter,
        applicant,
    }

    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Username is required")
    @Size(
        min = 3,
        max = 50,
        message = "Username must be between 3 and 50 characters"
    )
    private String username;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be between 6 and 100 characters")
    private String password;

    @NotNull(message = "Role is required")
    private Role role;

    private String company;
    private String createdAt;

    public Map<String, Object> getUserMap() {
        Map<String, Object> user = new HashMap<>();
        user.put("id", this.getId());
        user.put("name", this.getName());
        user.put("username", this.getUsername());
        user.put("role", this.getRole().toString()); // enum already lowercase
        user.put("company", this.getCompany()); // null ok in HashMap
        return user;
    }
}

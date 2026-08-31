package com.recruitly.backend.model;

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
    private String name;
    private String username;
    private String password;
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

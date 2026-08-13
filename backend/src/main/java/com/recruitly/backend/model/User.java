package com.recruitly.backend.model;

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

}

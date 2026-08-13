package com.recruitly.backend.model;

import lombok.Data;

@Data
public class Job {

    public enum Status { OPEN, CLOSED }
    public enum Type { FULL_TIME, PART_TIME, CONTRACT, REMOTE }

    private Long id;
    private Long recruiterId;
    private String title;
    private Status status;
    private String aboutRole;
    private String requirements;
    private String responsibilities;
    private String location;
    private Integer salary;      // in USD
    private Type type;
    private String createdAt;

}

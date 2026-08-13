package com.recruitly.backend.model;

import lombok.Data;

@Data
public class Application {

    public enum Status { APPLIED, INTERVIEWING, OFFERED, REJECTED }

    private Long id;
    private Long jobId;
    private Long candidateId;
    private Status status;
    private String createdAt;

}

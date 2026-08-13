package com.recruitly.backend.model;

import lombok.Data;

@Data
public class SavedJob {

    private Long id;
    private Long userId;
    private Long jobId;
    private String savedAt;

}

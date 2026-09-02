package com.recruitly.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.Data;

@Data
public class Application {

    public enum Status {
        APPLIED,
        SHORTLISTED,
        REJECTED,
        HIRED;
        @JsonCreator
        public static Status fromValue(String value) {
            return Status.valueOf(value.toUpperCase());
        }

        @JsonValue
        public String toValue() {
            return name().toLowerCase();
        }
    }

    private Long id;

    @JsonProperty("job_id")
    private Long jobId;

    private Long candidateId;
    private Status status;
    private String createdAt;
}

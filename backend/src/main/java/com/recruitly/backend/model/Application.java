package com.recruitly.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.validation.constraints.NotNull;
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

    @NotNull(message = "Status is required")
    private Status status;

    private String createdAt;

    public boolean allowTransition(Status newStatus) {
        switch (this.status) {
            case APPLIED:
                return newStatus != Status.HIRED && newStatus != Status.APPLIED;
            case SHORTLISTED:
                return newStatus != Status.APPLIED;
            case REJECTED:
                return false; // cant transition from REJECTED
            case HIRED:
                return false; // cant transition from HIRED
            default:
                return false;
        }
    }
}

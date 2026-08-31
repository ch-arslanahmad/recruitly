package com.recruitly.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Data;

@Data
public class Job {

    public enum Status {
        OPEN,
        CLOSED;

        @JsonCreator
        public static Status fromValue(String value) {
            return Status.valueOf(value.toUpperCase());
        }

        @JsonValue
        public String toValue() {
            return name().toLowerCase();
        }
    }

    public enum Type {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        REMOTE;

        @JsonCreator
        public static Type fromValue(String value) {
            return Type.valueOf(value.toUpperCase().replace("-", "_"));
        }

        @JsonValue
        public String toValue() {
            return name().toLowerCase().replace("_", "-");
        }
    }

    private Long id;
    private Long recruiterId;
    private String company;
    private String title;
    private Status status;

    @JsonProperty("about_role")
    private String aboutRole;

    private String requirements;
    private String responsibilities;
    private String location;
    private Integer salary; // in USD
    private Type type;
    private String createdAt;
}

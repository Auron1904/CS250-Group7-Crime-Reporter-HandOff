package com.sdsucrimereporter.dbapi.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_DEFAULT)
@Table(name = "reports")
public class Report {
    @Id
    @UuidGenerator
    @Column(name = "id", unique = true, updatable = false)
    private String reportId;

    // Link to the user who created this report
    @Column(name = "reporter_id", nullable = false)
    private String reporterId;

    // Date and time
    private String date;
    private String time;
    private String ampm;

    // Reporter info
    private String yourAge;
    private String yourGender;

    // Person involved
    private String personName;
    private String personAge;
    private String personGender;

    // Incident details
    @Column(length = 1000)
    private String incidentType; // Store as comma-separated: "Theft,Assault"

    @Column(length = 2000)
    private String description;

    // Location
    private String cordLat;
    private String cordLng;

    // Optional photo
    private String photoUrl;

    // Metadata
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
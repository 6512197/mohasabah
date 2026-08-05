package com.mohasabah.entities;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import lombok.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "achievements", schema = "mohasaba", uniqueConstraints = {
        @UniqueConstraint(name = "achievement_code", columnNames = {"achievement_code"})
})
public class Achievement implements Serializable {
    @Id
    @Column(name = "achievement_id", nullable = false)
    private Integer id;

    @Column(name = "achievement_code", nullable = false, length = 50)
    private String achievementCode;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "icon", length = 50)
    private String icon;

    @ColumnDefault("0")
    @Column(name = "points")
    private Integer points;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "created_at")
    private Instant createdAt;
}
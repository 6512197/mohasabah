package com.mohasabah.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "user_streaks", schema = "mohasaba", indexes = {
        @Index(name = "idx_streak_current", columnList = "current_streak")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_streak", columnNames = {"user_id"})
})
public class UserStreak {
    @Id
    @Column(name = "streak_id", nullable = false)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private com.mohasabah.entities.User user;

    @ColumnDefault("0")
    @Column(name = "current_streak")
    private Integer currentStreak;

    @ColumnDefault("0")
    @Column(name = "longest_streak")
    private Integer longestStreak;

    @Column(name = "last_entry_date")
    private LocalDate lastEntryDate;

    @Column(name = "streak_start_date")
    private LocalDate streakStartDate;

    @ColumnDefault("0")
    @Column(name = "total_entries")
    private Integer totalEntries;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

}
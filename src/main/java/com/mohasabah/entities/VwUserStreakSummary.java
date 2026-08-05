package com.mohasabah;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "vw_user_streak_summary", schema = "mohasaba")
public class VwUserStreakSummary {
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "current_streak")
    private Integer currentStreak;

    @Column(name = "longest_streak")
    private Integer longestStreak;

    @Column(name = "total_entries")
    private Integer totalEntries;

    @Column(name = "last_entry_date", length = 10)
    private String lastEntryDate;

    @Column(name = "days_since_last_entry")
    private Integer daysSinceLastEntry;

    @Column(name = "streak_status", length = 7)
    private String streakStatus;
    @Id
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
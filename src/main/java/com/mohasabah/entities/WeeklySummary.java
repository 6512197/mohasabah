package com.mohasabah.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "weekly_summaries", schema = "mohasaba", indexes = {
        @Index(name = "idx_weekly_user_date", columnList = "user_id, week_start_date"),
        @Index(name = "idx_weekly_completion", columnList = "completion_rate")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_week", columnNames = {"user_id", "week_start_date"})
})
public class WeeklySummary {
    @Id
    @Column(name = "weekly_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "week_start_date", nullable = false)
    private LocalDate weekStartDate;

    @Column(name = "week_end_date", nullable = false)
    private LocalDate weekEndDate;

    @ColumnDefault("0")
    @Column(name = "days_completed")
    private Byte daysCompleted;

    @ColumnDefault("0")
    @Column(name = "total_questions_answered")
    private Short totalQuestionsAnswered;

    @ColumnDefault("0.00")
    @Column(name = "completion_rate", precision = 3, scale = 2)
    private BigDecimal completionRate;

    @Lob
    @Column(name = "most_active_day")
    private String mostActiveDay;

    @Lob
    @Column(name = "key_insights")
    private String keyInsights;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

}
package com.mohasabah;

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
@Table(name = "daily_summaries", schema = "mohasaba", indexes = {
        @Index(name = "idx_summaries_date", columnList = "summary_date"),
        @Index(name = "idx_summaries_complete", columnList = "is_complete")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_summary_date", columnNames = {"user_id", "summary_date"})
})
public class DailySummary {
    @Id
    @Column(name = "summary_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private com.mohasabah.User user;

    @Column(name = "summary_date", nullable = false)
    private LocalDate summaryDate;

    @ColumnDefault("0")
    @Column(name = "total_questions_answered")
    private Byte totalQuestionsAnswered;

    @Lob
    @Column(name = "questions_answered")
    private String questionsAnswered;

    @Column(name = "average_mood", precision = 3, scale = 2)
    private BigDecimal averageMood;

    @Lob
    @Column(name = "top_categories")
    private String topCategories;

    @Lob
    @Column(name = "reflection_excerpt")
    private String reflectionExcerpt;

    @ColumnDefault("0")
    @Column(name = "is_complete")
    private Boolean isComplete;

    @Column(name = "completed_at")
    private Instant completedAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

}
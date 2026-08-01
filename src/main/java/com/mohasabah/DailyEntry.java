package com.mohasabah;

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
@Table(name = "daily_entries", schema = "mohasaba", indexes = {
        @Index(name = "idx_entries_user_date", columnList = "user_id, entry_date"),
        @Index(name = "idx_entries_question", columnList = "question_id"),
        @Index(name = "idx_entries_submitted", columnList = "is_submitted, entry_date")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_question_date", columnNames = {"user_id", "question_id", "entry_date"})
})
public class DailyEntry {
    @Id
    @Column(name = "entry_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private com.mohasabah.User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "question_id", nullable = false)
    private com.mohasabah.DailyQuestion question;

    @Column(name = "entry_date", nullable = false)
    private LocalDate entryDate;

    @Lob
    @Column(name = "answer_text")
    private String answerText;

    @Column(name = "star_rating")
    private Byte starRating;

    @Column(name = "answer_choice", length = 50)
    private String answerChoice;

    @ColumnDefault("0")
    @Column(name = "is_submitted")
    private Boolean isSubmitted;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

}
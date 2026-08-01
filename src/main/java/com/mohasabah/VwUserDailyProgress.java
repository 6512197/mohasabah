package com.mohasabah;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Mapping for DB view
 */
@Getter
@Setter
@Entity
@Immutable
@Table(name = "vw_user_daily_progress", schema = "mohasaba")
public class VwUserDailyProgress {
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "entry_date")
    private LocalDate entryDate;

    @Column(name = "questions_answered", nullable = false)
    private Long questionsAnswered;

    @Column(name = "total_questions", nullable = false)
    private Long totalQuestions;

    @Column(name = "completion_percentage", precision = 25, scale = 1)
    private BigDecimal completionPercentage;

    @Column(name = "is_complete")
    private Boolean isComplete;

}
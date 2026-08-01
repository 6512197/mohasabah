package com.mohasabah;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "vw_weekly_question_progress", schema = "mohasaba")
public class VwWeeklyQuestionProgress {
    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "week_number")
    private Integer weekNumber;

    @Column(name = "year")
    private Integer year;

    @Column(name = "questions_answered_this_week", nullable = false)
    private Long questionsAnsweredThisWeek;

    @Column(name = "submitted_this_week", nullable = false)
    private Long submittedThisWeek;

}
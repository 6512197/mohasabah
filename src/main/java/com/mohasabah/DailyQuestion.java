package com.mohasabah;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "daily_questions", schema = "mohasaba", indexes = {
        @Index(name = "idx_questions_number", columnList = "question_number"),
        @Index(name = "idx_questions_sunday", columnList = "is_sunday_question")
}, uniqueConstraints = {
        @UniqueConstraint(name = "question_number", columnNames = {"question_number"})
})
public class DailyQuestion {
    @Id
    @Column(name = "question_id", nullable = false)
    private Integer id;

    @Column(name = "question_number", nullable = false)
    private Byte questionNumber;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Lob
    @Column(name = "question_text", nullable = false)
    private String questionText;

    @ColumnDefault("'text'")
    @Lob
    @Column(name = "question_type")
    private String questionType;

    @Lob
    @Column(name = "choice_options")
    private String choiceOptions;

    @ColumnDefault("0")
    @Column(name = "is_sunday_question")
    private Boolean isSundayQuestion;

    @ColumnDefault("0")
    @Column(name = "display_order")
    private Byte displayOrder;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

}
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
@Table(name = "morning_prompts", schema = "mohasaba", indexes = {
        @Index(name = "idx_prompts_user_date", columnList = "user_id, prompt_date"),
        @Index(name = "idx_prompts_date", columnList = "prompt_date")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_prompt_date", columnNames = {"user_id", "prompt_date"})
})
public class MorningPrompt {
    @Id
    @Column(name = "prompt_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private com.mohasabah.User user;

    @Column(name = "prompt_date", nullable = false)
    private LocalDate promptDate;

    @Lob
    @Column(name = "yesterday_reflection")
    private String yesterdayReflection;

    @Lob
    @Column(name = "intention_today", nullable = false)
    private String intentionToday;

    @ColumnDefault("'okay'")
    @Lob
    @Column(name = "mood_before")
    private String moodBefore;

    @ColumnDefault("'fair'")
    @Lob
    @Column(name = "sleep_quality")
    private String sleepQuality;

    @ColumnDefault("current_timestamp()")
    @Column(name = "submitted_at")
    private Instant submittedAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

}
package com.mohasabah;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "user_achievements", schema = "mohasaba", indexes = {
        @Index(name = "achievement_id", columnList = "achievement_id"),
        @Index(name = "idx_user_ach_earned", columnList = "earned_at")
})
public class UserAchievement {
    @EmbeddedId
    private UserAchievementId id;

    @MapsId("userId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private com.mohasabah.User user;

    @MapsId("achievementId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "achievement_id", nullable = false)
    private Achievement achievement;

    @ColumnDefault("current_timestamp()")
    @Column(name = "earned_at")
    private Instant earnedAt;

    @ColumnDefault("0")
    @Column(name = "progress")
    private Integer progress;

    @ColumnDefault("1")
    @Column(name = "is_displayed")
    private Boolean isDisplayed;

}
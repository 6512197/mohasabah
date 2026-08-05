package com.mohasabah.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "user_settings", schema = "mohasaba", indexes = {
        @Index(name = "avatar_style_id", columnList = "avatar_style_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_settings", columnNames = {"user_id"})
})
public class UserSetting {
    @Id
    @Column(name = "setting_id", nullable = false)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private com.mohasabah.entities.User user;

    @ColumnDefault("'08:00:00'")
    @Column(name = "morning_nudge_time")
    private LocalTime morningNudgeTime;

    @ColumnDefault("'21:00:00'")
    @Column(name = "evening_nudge_time")
    private LocalTime eveningNudgeTime;

    @ColumnDefault("'Sunday'")
    @Lob
    @Column(name = "weekly_report_day")
    private String weeklyReportDay;

    @ColumnDefault("1")
    @Column(name = "notification_enabled")
    private Boolean notificationEnabled;

    @ColumnDefault("1")
    @Column(name = "email_notifications")
    private Boolean emailNotifications;

    @ColumnDefault("'dark'")
    @Lob
    @Column(name = "ui_theme")
    private String uiTheme;

    @ColumnDefault("'en'")
    @Column(name = "language", length = 10)
    private String language;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avatar_style_id")
    private AvatarStyle avatarStyle;

    @ColumnDefault("1")
    @Column(name = "avatar_show_ring")
    private Boolean avatarShowRing;

    @ColumnDefault("'#2fd8ff'")
    @Column(name = "avatar_ring_color", length = 7)
    private String avatarRingColor;

    @ColumnDefault("1")
    @Column(name = "avatar_animation_enabled")
    private Boolean avatarAnimationEnabled;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

}
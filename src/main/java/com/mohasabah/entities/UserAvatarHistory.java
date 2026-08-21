package com.mohasabah.entities;

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
@Table(name = "user_avatar_history", schema = "mohasaba", indexes = {
        @Index(name = "idx_avatar_history_user", columnList = "user_id, changed_at")
})
public class UserAvatarHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "avatar_history_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private com.mohasabah.entities.User user;

    @Lob
    @Column(name = "avatar_type", nullable = false)
    private String avatarType;

    @Lob
    @Column(name = "avatar_svg")
    private String avatarSvg;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(name = "avatar_color", length = 7)
    private String avatarColor;

    @Column(name = "avatar_initials", length = 4)
    private String avatarInitials;

    @ColumnDefault("current_timestamp()")
    @Column(name = "changed_at")
    private Instant changedAt;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Lob
    @Column(name = "user_agent")
    private String userAgent;

}
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
@Table(name = "user_sessions", schema = "mohasaba", indexes = {
        @Index(name = "idx_sessions_user_expires", columnList = "user_id, expires_at"),
        @Index(name = "idx_sessions_token", columnList = "refresh_token")
})
public class UserSession {
    @Id
    @ColumnDefault("uuid()")
    @Column(name = "session_id", nullable = false, length = 36)
    private String sessionId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private com.mohasabah.entities.User user;

    @Column(name = "refresh_token", nullable = false)
    private String refreshToken;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Lob
    @Column(name = "user_agent")
    private String userAgent;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

}
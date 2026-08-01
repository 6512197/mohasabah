package com.mohasabah;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "users", schema = "mohasaba", indexes = {
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_active_status", columnList = "is_active, deleted_at"),
        @Index(name = "idx_users_created", columnList = "created_at")
}, uniqueConstraints = {
        @UniqueConstraint(name = "email", columnNames = {"email"})
})
public class User {
    @Id
    @Column(name = "user_id", nullable = false)
    private Integer id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @ColumnDefault("'UTC'")
    @Column(name = "timezone", length = 50)
    private String timezone;

    @ColumnDefault("'initials'")
    @Lob
    @Column(name = "avatar_type")
    private String avatarType;

    @Lob
    @Column(name = "avatar_svg")
    private String avatarSvg;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @ColumnDefault("'#2fd8ff'")
    @Column(name = "avatar_color", length = 7)
    private String avatarColor;

    @Column(name = "avatar_initials", length = 4)
    private String avatarInitials;

    @Column(name = "avatar_uploaded_at")
    private Instant avatarUploadedAt;

    @ColumnDefault("0")
    @Column(name = "email_verified")
    private Boolean emailVerified;

    @ColumnDefault("1")
    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "last_login")
    private Instant lastLogin;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "deleted_at")
    private Instant deletedAt;

}
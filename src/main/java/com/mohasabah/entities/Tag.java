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
@Table(name = "tags", schema = "mohasaba", indexes = {
        @Index(name = "idx_tags_user", columnList = "user_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_tag_user_name", columnNames = {"user_id", "tag_name"})
})
public class Tag {
    @Id
    @Column(name = "tag_id", nullable = false)
    private Integer id;

    @Column(name = "tag_name", nullable = false, length = 50)
    private String tagName;

    @ColumnDefault("'#2fd8ff'")
    @Column(name = "color", length = 7)
    private String color;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private com.mohasabah.entities.User user;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

}
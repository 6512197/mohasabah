package com.mohasabah;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "avatar_styles", schema = "mohasaba", indexes = {
        @Index(name = "idx_styles_active", columnList = "is_active")
}, uniqueConstraints = {
        @UniqueConstraint(name = "style_name", columnNames = {"style_name"})
})
public class AvatarStyle {
    @Id
    @Column(name = "style_id", nullable = false)
    private Integer id;

    @Column(name = "style_name", nullable = false, length = 50)
    private String styleName;

    @ColumnDefault("'geometric'")
    @Lob
    @Column(name = "style_type")
    private String styleType;

    @Lob
    @Column(name = "svg_template", nullable = false)
    private String svgTemplate;

    @Lob
    @Column(name = "default_colors")
    private String defaultColors;

    @ColumnDefault("1")
    @Column(name = "is_active")
    private Boolean isActive;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

}
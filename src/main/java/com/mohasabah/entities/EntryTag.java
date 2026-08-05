package com.mohasabah.entities;

import com.mohasabah.entities.EntryTag;
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
@Table(name = "entry_tags", schema = "mohasaba", indexes = {
        @Index(name = "idx_tag_entries", columnList = "tag_id")
})
public class EntryTag {
    @EmbeddedId
    private EntryTagId id;

    @MapsId("entryId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "entry_id", nullable = false)
    private DailyEntry entry;

    @MapsId("tagId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "tag_id", nullable = false)
    private com.mohasabah.entities.Tag tag;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

}
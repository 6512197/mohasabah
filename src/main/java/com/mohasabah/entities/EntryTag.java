package com.mohasabah.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.io.Serializable;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "entry_tags", schema = "mohasaba", indexes = {
        @Index(name = "idx_tag_entries", columnList = "tag_id")
})
public class EntryTag implements Serializable {

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
    private Tag tag;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
}
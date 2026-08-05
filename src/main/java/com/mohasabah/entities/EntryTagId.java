package com.mohasabah.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Objects;

@Getter
@Setter
@Embeddable
public class EntryTagId implements java.io.Serializable {
    private static final long serialVersionUID = 2572545118154992441L;
    @Column(name = "entry_id", nullable = false)
    private Integer entryId;

    @Column(name = "tag_id", nullable = false)
    private Integer tagId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        EntryTagId entity = (EntryTagId) o;
        return Objects.equals(this.tagId, entity.tagId) &&
                Objects.equals(this.entryId, entity.entryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(tagId, entryId);
    }

}
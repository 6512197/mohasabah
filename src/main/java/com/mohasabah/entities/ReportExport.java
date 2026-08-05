package com.mohasabah.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "report_exports", schema = "mohasaba", indexes = {
        @Index(name = "idx_reports_user_date", columnList = "user_id, report_date"),
        @Index(name = "idx_reports_period", columnList = "report_period")
})
public class ReportExport {
    @Id
    @Column(name = "report_id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private com.mohasabah.entities.User user;

    @Lob
    @Column(name = "report_period", nullable = false)
    private String reportPeriod;

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Lob
    @Column(name = "report_data", nullable = false)
    private String reportData;

    @Column(name = "pdf_url", length = 500)
    private String pdfUrl;

    @ColumnDefault("0")
    @Column(name = "download_count")
    private Integer downloadCount;

    @Column(name = "last_downloaded")
    private Instant lastDownloaded;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at")
    private Instant createdAt;

    @ColumnDefault("current_timestamp()")
    @Column(name = "updated_at")
    private Instant updatedAt;

}
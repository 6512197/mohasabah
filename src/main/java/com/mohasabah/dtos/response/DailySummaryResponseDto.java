package com.mohasabah.dtos.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record DailySummaryResponseDto(
        Integer id,
        Integer userId,
        LocalDate summaryDate,
        Byte totalQuestionsAnswered,
        BigDecimal averageMood,
        String reflectionExcerpt,
        Boolean isComplete,
        Instant completedAt
) {
}

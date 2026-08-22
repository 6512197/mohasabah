package com.mohasabah.dtos;

import java.time.Instant;
import java.time.LocalDate;

public record DailyEntryResponseDto(
        Integer id,
        Integer userId,
        Integer questionId,
        LocalDate entryDate,
        String answerText,
        Byte starRating,
        String answerChoice,
        Boolean isSubmitted,
        Instant submittedAt,
        Instant createdAt
) {
}

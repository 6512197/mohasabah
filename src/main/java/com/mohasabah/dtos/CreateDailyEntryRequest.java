package com.mohasabah.dtos;

import java.time.LocalDate;
import java.util.List;

public record CreateDailyEntryRequest(
        Integer questionId,
        LocalDate entryDate,
        String answerText,
        Byte starRating,
        String answerChoice,
        Boolean isSubmitted,
        List<Integer> tagIds

) {
}

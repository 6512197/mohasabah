package com.mohasabah.dtos;

public record DailyQuestionResponseDto(
        Integer id,
        Byte questionNumber,
        String category,
        String questionText,
        String questionType,
        String choiceOptions,
        Boolean isSundayQuestion,
        Byte displayOrder
) {
}

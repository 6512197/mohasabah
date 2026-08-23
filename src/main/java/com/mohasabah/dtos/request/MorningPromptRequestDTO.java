package com.mohasabah.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

/**
 * Morning Prompt Request DTO - What the client sends when creating/updating a morning prompt
 * Using Record for immutability and clean code
 */
public record MorningPromptRequestDTO(

        @NotNull(message = "Prompt date is required")
        @PastOrPresent(message = "Prompt date cannot be in the future")
        LocalDate promptDate,

        @Size(max = 500, message = "Reflection must be less than 500 characters")
        String yesterdayReflection,

        @NotBlank(message = "Intention for today is required")
        @Size(max = 200, message = "Intention must be less than 200 characters")
        String intentionToday,

        Integer moodBefore, // e.g.,  1-5 "HAPPY", "TIRED", "STRESSED", "ANXIOUS"

        Integer sleepQuality, // e.g.,  1-5 "POOR", "FAIR", "GOOD", "EXCELLENT"

        Integer energyLevel // 1-5, optional

       // work relation rest
 //kindness


) {}
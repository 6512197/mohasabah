package com.mohasabah.dtos;

public record AchievementResponseDto(
        Integer id,
        String achievementCode,
        String name,
        String description,
        String icon,
        Integer points,
        String category
) {}
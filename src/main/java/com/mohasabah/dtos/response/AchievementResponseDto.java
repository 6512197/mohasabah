package com.mohasabah.dtos.response;

public record AchievementResponseDto(
        Integer id,
        String achievementCode,
        String name,
        String description,
        String icon,
        Integer points,
        String category
) {}
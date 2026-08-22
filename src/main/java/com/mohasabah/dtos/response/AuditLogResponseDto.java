package com.mohasabah.dtos.response;

import java.time.Instant;

public record AuditLogResponseDto(
        Integer id,
        Integer userId,
        String action,
        String entityType,
        Integer entityId,
        String ipAddress,
        Instant createdAt
) {

}

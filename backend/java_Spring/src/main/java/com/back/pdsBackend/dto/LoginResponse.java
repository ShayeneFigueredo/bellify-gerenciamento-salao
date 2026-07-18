package com.back.pdsBackend.dto;

import java.time.Instant;

public record LoginResponse(String token, Instant expiraEm, UserResponse usuario) {
}

package com.back.pdsBackend.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyPasswordRequest(@NotBlank String senha) {
}

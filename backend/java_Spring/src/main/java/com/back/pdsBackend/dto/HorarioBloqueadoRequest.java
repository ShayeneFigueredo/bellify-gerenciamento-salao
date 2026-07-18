package com.back.pdsBackend.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record HorarioBloqueadoRequest(
        @NotNull LocalDateTime inicio,
        @NotNull LocalDateTime fim,
        String motivo
) {
}

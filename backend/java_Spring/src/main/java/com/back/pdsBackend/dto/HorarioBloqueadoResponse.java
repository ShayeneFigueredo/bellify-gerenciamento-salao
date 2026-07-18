package com.back.pdsBackend.dto;

import com.back.pdsBackend.model.HorarioBloqueado;
import java.time.LocalDateTime;

public record HorarioBloqueadoResponse(Long id, Long profissionalId, LocalDateTime inicio, LocalDateTime fim, String motivo) {
    public static HorarioBloqueadoResponse de(HorarioBloqueado horario) {
        return new HorarioBloqueadoResponse(
                horario.getId(),
                horario.getProfissional().getId(),
                horario.getInicio(),
                horario.getFim(),
                horario.getMotivo()
        );
    }
}

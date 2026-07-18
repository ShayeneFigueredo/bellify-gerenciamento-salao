package com.back.pdsBackend.controller;

import com.back.pdsBackend.dto.HorarioBloqueadoRequest;
import com.back.pdsBackend.dto.HorarioBloqueadoResponse;
import com.back.pdsBackend.dto.ProfissionalRequest;
import com.back.pdsBackend.dto.UserResponse;
import com.back.pdsBackend.service.HorarioBloqueadoService;
import com.back.pdsBackend.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profissionais")
public class ProfissionalController {

    private final UserService servicoUsuario;
    private final HorarioBloqueadoService servicoHorario;

    public ProfissionalController(UserService servicoUsuario, HorarioBloqueadoService servicoHorario) {
        this.servicoUsuario = servicoUsuario;
        this.servicoHorario = servicoHorario;
    }

    @GetMapping
    public List<UserResponse> listarTodos() {
        return servicoUsuario.listarProfissionais().stream().map(UserResponse::de).toList();
    }

    @PostMapping
    public UserResponse criar(@Valid @RequestBody ProfissionalRequest requisicao) {
        return UserResponse.de(servicoUsuario.cadastrarProfissional(requisicao));
    }

    @GetMapping("/{id}/horarios-bloqueados")
    public List<HorarioBloqueadoResponse> listarHorarios(@PathVariable Long id) {
        return servicoHorario.listarPorProfissional(id).stream().map(HorarioBloqueadoResponse::de).toList();
    }

    @PostMapping("/{id}/horarios-bloqueados")
    public HorarioBloqueadoResponse bloquearHorario(
            @PathVariable Long id,
            @Valid @RequestBody HorarioBloqueadoRequest requisicao
    ) {
        return HorarioBloqueadoResponse.de(servicoHorario.bloquear(id, requisicao));
    }
}

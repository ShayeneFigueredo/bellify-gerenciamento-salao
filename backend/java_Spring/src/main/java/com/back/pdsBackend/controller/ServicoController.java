package com.back.pdsBackend.controller;

import com.back.pdsBackend.dto.ServicoRequest;
import com.back.pdsBackend.dto.ServicoResponse;
import com.back.pdsBackend.service.ServicoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/servicos")
public class ServicoController {

    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @GetMapping
    public List<ServicoResponse> listarTodos() {
        return servicoService.listarTodos().stream().map(ServicoResponse::de).toList();
    }

    @PostMapping
    public ServicoResponse criar(@Valid @RequestBody ServicoRequest requisicao) {
        return ServicoResponse.de(servicoService.criar(requisicao));
    }
}

package com.back.pdsBackend.controller;

import com.back.pdsBackend.dto.CreateUserRequest;
import com.back.pdsBackend.dto.UserResponse;
import com.back.pdsBackend.dto.VerifyPasswordRequest;
import com.back.pdsBackend.dto.VerifyPasswordResponse;
import com.back.pdsBackend.service.UserService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/usuarios")
public class UserController {

    private final UserService servicoUsuario;

    public UserController(UserService servicoUsuario) {
        this.servicoUsuario = servicoUsuario;
    }

    @PostMapping
    public ResponseEntity<UserResponse> criar(@Valid @RequestBody CreateUserRequest requisicao) {
        UserResponse resposta = UserResponse.de(servicoUsuario.criar(requisicao));
        return ResponseEntity.created(URI.create("/usuarios/" + resposta.id())).body(resposta);
    }

    @GetMapping
    public List<UserResponse> listarTodos() {
        return servicoUsuario.listarTodos().stream()
                .map(UserResponse::de)
                .toList();
    }

    @GetMapping("/{id}")
    public UserResponse buscarPorId(@PathVariable Long id) {
        return UserResponse.de(servicoUsuario.buscarPorId(id));
    }

    @PostMapping("/{id}/verificar-senha")
    public VerifyPasswordResponse verificarSenha(
            @PathVariable Long id,
            @Valid @RequestBody VerifyPasswordRequest requisicao
    ) {
        return new VerifyPasswordResponse(servicoUsuario.verificarSenha(id, requisicao.senha()));
    }
}

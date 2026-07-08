package com.back.pdsBackend.controller;

import com.back.pdsBackend.dto.CadastroRequest;
import com.back.pdsBackend.dto.LoginRequest;
import com.back.pdsBackend.dto.LoginResponse;
import com.back.pdsBackend.dto.UserResponse;
import com.back.pdsBackend.model.SessionToken;
import com.back.pdsBackend.model.User;
import com.back.pdsBackend.service.SessionService;
import com.back.pdsBackend.service.UserService;
import jakarta.validation.Valid;
import java.net.URI;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService servicoUsuario;
    private final SessionService servicoSessao;

    public AuthController(UserService servicoUsuario, SessionService servicoSessao) {
        this.servicoUsuario = servicoUsuario;
        this.servicoSessao = servicoSessao;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<UserResponse> cadastrar(@Valid @RequestBody CadastroRequest requisicao) {
        UserResponse resposta = UserResponse.de(servicoUsuario.cadastrar(requisicao));
        return ResponseEntity.created(URI.create("/api/usuarios/" + resposta.id())).body(resposta);
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest requisicao) {
        User usuario = servicoUsuario.autenticar(requisicao.email(), requisicao.senha());
        SessionToken sessao = servicoSessao.criarSessao(usuario);
        return new LoginResponse(sessao.getToken(), sessao.getExpiraEm(), UserResponse.de(usuario));
    }
}
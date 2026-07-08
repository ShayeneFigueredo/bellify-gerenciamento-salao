package com.back.pdsBackend.service;

import com.back.pdsBackend.model.SessionToken;
import com.back.pdsBackend.model.User;
import com.back.pdsBackend.repository.SessionTokenRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class SessionService {

    private final SessionTokenRepository repositorioSessao;

    public SessionService(SessionTokenRepository repositorioSessao) {
        this.repositorioSessao = repositorioSessao;
    }

    public SessionToken criarSessao(User usuario) {
        Instant agora = Instant.now();
        SessionToken sessao = new SessionToken(
                UUID.randomUUID().toString(),
                usuario,
                agora,
                agora.plus(8, ChronoUnit.HOURS)
        );

        return repositorioSessao.save(sessao);
    }

    public User buscarUsuarioPorToken(String token) {
        return repositorioSessao.findByTokenAndAtivoTrueAndExpiraEmAfter(token, Instant.now())
                .orElseThrow(() -> new IllegalArgumentException("Sessao invalida"))
                .getUsuario();
    }
}
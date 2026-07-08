package com.back.pdsBackend.service;

import com.back.pdsBackend.dto.CadastroRequest;
import com.back.pdsBackend.model.PerfilUsuario;
import com.back.pdsBackend.model.User;
import com.back.pdsBackend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository repositorioUsuario;
    private final PasswordEncoder codificadorSenha;

    public UserService(UserRepository repositorioUsuario, PasswordEncoder codificadorSenha) {
        this.repositorioUsuario = repositorioUsuario;
        this.codificadorSenha = codificadorSenha;
    }

    public User cadastrar(CadastroRequest requisicao) {
        PerfilUsuario perfil = converterPerfil(requisicao.perfil());
        String nome = escolherNome(requisicao.nome(), requisicao.salao());

        return criarUsuario(
                nome,
                requisicao.email(),
                requisicao.senha(),
                perfil,
                limpar(requisicao.telefone()),
                limpar(requisicao.salao()),
                limpar(requisicao.endereco()),
                limpar(requisicao.especialidade())
        );
    }

    private User criarUsuario(
            String nome,
            String email,
            String senha,
            PerfilUsuario perfil,
            String telefone,
            String salao,
            String endereco,
            String especialidade
    ) {
        if (repositorioUsuario.existsByEmail(email)) {
            throw new IllegalArgumentException("Email ja cadastrado");
        }

        User usuario = new User(
                nome,
                email,
                codificadorSenha.encode(senha),
                perfil,
                telefone,
                salao,
                endereco,
                especialidade
        );
        return repositorioUsuario.save(usuario);
    }

    public User buscarPorEmail(String email) {
        return repositorioUsuario.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario nao encontrado: " + email));
    }

    public User autenticar(String email, String senha) {
        User usuario = buscarPorEmail(email);

        if (!codificadorSenha.matches(senha, usuario.getSenhaHash())) {
            throw new IllegalArgumentException("Email ou senha invalidos");
        }

        return usuario;
    }

    private PerfilUsuario converterPerfil(String valor) {
        if (valor == null || valor.isBlank()) {
            return PerfilUsuario.CLIENTE;
        }

        try {
            return PerfilUsuario.valueOf(valor.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException excecao) {
            throw new IllegalArgumentException("Perfil invalido");
        }
    }

    private String escolherNome(String nome, String salao) {
        String nomeLimpo = limpar(nome);
        if (nomeLimpo != null) {
            return nomeLimpo;
        }

        String salaoLimpo = limpar(salao);
        if (salaoLimpo != null) {
            return salaoLimpo;
        }

        throw new IllegalArgumentException("Nome eh obrigatorio");
    }

    private String limpar(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }

        return valor.trim();
    }
}
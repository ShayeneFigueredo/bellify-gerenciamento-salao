package com.back.pdsBackend.dto;

import com.back.pdsBackend.model.User;

public record UserResponse(
        Long id,
        String nome,
        String email,
        String perfil,
        String telefone,
        String salao,
        String endereco,
        String especialidade
) {

    public static UserResponse de(User usuario) {
        return new UserResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPerfil().name().toLowerCase(),
                usuario.getTelefone(),
                usuario.getSalao(),
                usuario.getEndereco(),
                usuario.getEspecialidade()
        );
    }
}

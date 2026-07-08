package com.back.pdsBackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroRequest(
        String perfil,
        String nome,
        String salao,
        @NotBlank @Email String email,
        String telefone,
        String endereco,
        String especialidade,
        @NotBlank @Size(min = 6) String senha
) {
}
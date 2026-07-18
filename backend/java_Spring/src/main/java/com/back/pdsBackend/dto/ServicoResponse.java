package com.back.pdsBackend.dto;

import com.back.pdsBackend.model.Servico;
import java.math.BigDecimal;

public record ServicoResponse(Long id, String nome, Integer duracao, BigDecimal preco) {
    public static ServicoResponse de(Servico servico) {
        return new ServicoResponse(servico.getId(), servico.getNome(), servico.getDuracao(), servico.getPreco());
    }
}

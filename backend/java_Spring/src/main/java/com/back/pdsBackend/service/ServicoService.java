package com.back.pdsBackend.service;

import com.back.pdsBackend.dto.ServicoRequest;
import com.back.pdsBackend.model.Servico;
import com.back.pdsBackend.repository.ServicoRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ServicoService {

    private final ServicoRepository repositorioServico;

    public ServicoService(ServicoRepository repositorioServico) {
        this.repositorioServico = repositorioServico;
    }

    public Servico criar(ServicoRequest requisicao) {
        return repositorioServico.save(new Servico(requisicao.nome(), requisicao.duracao(), requisicao.preco()));
    }

    public List<Servico> listarTodos() {
        return repositorioServico.findAll();
    }
}

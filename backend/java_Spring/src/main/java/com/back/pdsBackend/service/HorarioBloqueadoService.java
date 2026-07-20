package com.back.pdsBackend.service;

import com.back.pdsBackend.dto.HorarioBloqueadoRequest;
import com.back.pdsBackend.model.HorarioBloqueado;
import com.back.pdsBackend.model.PerfilUsuario;
import com.back.pdsBackend.model.User;
import com.back.pdsBackend.repository.HorarioBloqueadoRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class HorarioBloqueadoService {

    private final HorarioBloqueadoRepository repositorioHorario;
    private final UserService servicoUsuario;

    public HorarioBloqueadoService(HorarioBloqueadoRepository repositorioHorario, UserService servicoUsuario) {
        this.repositorioHorario = repositorioHorario;
        this.servicoUsuario = servicoUsuario;
    }

    public HorarioBloqueado bloquear(Long profissionalId, HorarioBloqueadoRequest requisicao) {
        User profissional = servicoUsuario.buscarPorId(profissionalId);
        if (profissional.getPerfil() != PerfilUsuario.PROFISSIONAL) {
            throw new IllegalArgumentException("Usuario nao e profissional");
        }
        if (!requisicao.fim().isAfter(requisicao.inicio())) {
            throw new IllegalArgumentException("Fim deve ser depois do inicio");
        }
        return repositorioHorario.save(new HorarioBloqueado(profissional, requisicao.inicio(), requisicao.fim(), requisicao.motivo()));
    }

    public List<HorarioBloqueado> listarPorProfissional(Long profissionalId) {
        return repositorioHorario.findByProfissionalId(profissionalId);
    }
}

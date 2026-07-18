package com.back.pdsBackend.repository;

import com.back.pdsBackend.model.HorarioBloqueado;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HorarioBloqueadoRepository extends JpaRepository<HorarioBloqueado, Long> {
    List<HorarioBloqueado> findByProfissionalId(Long profissionalId);
}

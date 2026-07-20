package com.back.pdsBackend.repository;

import com.back.pdsBackend.model.User;
import com.back.pdsBackend.model.PerfilUsuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByPerfil(PerfilUsuario perfil);
}

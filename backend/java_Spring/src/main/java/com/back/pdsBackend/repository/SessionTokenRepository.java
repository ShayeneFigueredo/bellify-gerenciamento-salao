package com.back.pdsBackend.repository;

import com.back.pdsBackend.model.SessionToken;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionTokenRepository extends JpaRepository<SessionToken, Long> {

    Optional<SessionToken> findByTokenAndAtivoTrueAndExpiraEmAfter(String token, Instant agora);
}
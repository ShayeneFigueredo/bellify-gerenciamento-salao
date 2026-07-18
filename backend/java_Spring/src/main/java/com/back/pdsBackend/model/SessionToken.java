package com.back.pdsBackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;

@Entity
@Table(name = "sessoes")
public class SessionToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User usuario;

    @Column(nullable = false)
    private Instant criadoEm;

    @Column(nullable = false)
    private Instant expiraEm;

    @Column(nullable = false)
    private boolean ativo;

    protected SessionToken() {
    }

    public SessionToken(String token, User usuario, Instant criadoEm, Instant expiraEm) {
        this.token = token;
        this.usuario = usuario;
        this.criadoEm = criadoEm;
        this.expiraEm = expiraEm;
        this.ativo = true;
    }

    public Long getId() {
        return id;
    }

    public String getToken() {
        return token;
    }

    public User getUsuario() {
        return usuario;
    }

    public Instant getCriadoEm() {
        return criadoEm;
    }

    public Instant getExpiraEm() {
        return expiraEm;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}

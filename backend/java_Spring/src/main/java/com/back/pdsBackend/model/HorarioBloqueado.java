package com.back.pdsBackend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "horarios_bloqueados")
public class HorarioBloqueado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private User profissional;

    private LocalDateTime inicio;
    private LocalDateTime fim;
    private String motivo;

    protected HorarioBloqueado() {
    }

    public HorarioBloqueado(User profissional, LocalDateTime inicio, LocalDateTime fim, String motivo) {
        this.profissional = profissional;
        this.inicio = inicio;
        this.fim = fim;
        this.motivo = motivo;
    }

    public Long getId() { return id; }
    public User getProfissional() { return profissional; }
    public LocalDateTime getInicio() { return inicio; }
    public LocalDateTime getFim() { return fim; }
    public String getMotivo() { return motivo; }
}

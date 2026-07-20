package com.back.pdsBackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "servicos")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private Integer duracao;

    @Column(nullable = false)
    private BigDecimal preco;

    protected Servico() {
    }

    public Servico(String nome, Integer duracao, BigDecimal preco) {
        this.nome = nome;
        this.duracao = duracao;
        this.preco = preco;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public Integer getDuracao() { return duracao; }
    public BigDecimal getPreco() { return preco; }
}

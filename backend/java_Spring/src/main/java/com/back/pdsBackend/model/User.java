package com.back.pdsBackend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuarios")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senhaHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PerfilUsuario perfil;

    private String telefone;

    private String salao;

    private String endereco;

    private String especialidade;

    protected User() {
    }

    public User(
            String nome,
            String email,
            String senhaHash,
            PerfilUsuario perfil,
            String telefone,
            String salao,
            String endereco,
            String especialidade
    ) {
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.perfil = perfil;
        this.telefone = telefone;
        this.salao = salao;
        this.endereco = endereco;
        this.especialidade = especialidade;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public PerfilUsuario getPerfil() {
        return perfil;
    }

    public String getTelefone() {
        return telefone;
    }

    public String getSalao() {
        return salao;
    }

    public String getEndereco() {
        return endereco;
    }

    public String getEspecialidade() {
        return especialidade;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setSenhaHash(String senhaHash) {
        this.senhaHash = senhaHash;
    }

    public void setPerfil(PerfilUsuario perfil) {
        this.perfil = perfil;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public void setSalao(String salao) {
        this.salao = salao;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }
}
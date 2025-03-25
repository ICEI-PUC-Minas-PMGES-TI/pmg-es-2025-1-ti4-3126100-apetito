package com.Apetito.Apetito.models;

import jakarta.persistence.*;

@Entity
@Table(name = "mesas")
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer numero;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StatusMesa status;

// TODO: Adicionar relacionamento com Comanda quando a entidade Comanda for criada
//@OneToOne(mappedBy = "mesa")
//private Comanda comanda;

    public Mesa() {}

    public Mesa(Integer numero, StatusMesa status) {
        this.numero = numero;
        this.status = status;
    }

    public enum StatusMesa {
        DISPONIVEL,
        OCUPADA
    }

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public StatusMesa getStatus() {
        return status;
    }

    public void setStatus(StatusMesa status) {
        this.status = status;
    }
}
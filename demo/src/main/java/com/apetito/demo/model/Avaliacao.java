package com.apetito.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

@Entity
public class Avaliacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int notaComida;
    private int notaAtendimento;
    private int notaAmbiente;
    private String comentario;

    // Getters e setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNotaComida() {
        return notaComida;
    }

    public void setNotaComida(int notaComida) {
        this.notaComida = notaComida;
    }

    public int getNotaAtendimento() {
        return notaAtendimento;
    }

    public void setNotaAtendimento(int notaAtendimento) {
        this.notaAtendimento = notaAtendimento;
    }

    public int getNotaAmbiente() {
        return notaAmbiente;
    }

    public void setNotaAmbiente(int notaAmbiente) {
        this.notaAmbiente = notaAmbiente;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}


package com.Apetito.Apetito.dtos;

import com.Apetito.Apetito.models.Mesa;

public class MesaDTO {

    private Integer numero;
    private Mesa.StatusMesa status;

    public MesaDTO() {}

    public MesaDTO(Integer numero, Mesa.StatusMesa status) {
        this.numero = numero;
        this.status = status;
    }

    // Getters e Setters
    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public Mesa.StatusMesa getStatus() {
        return status;
    }

    public void setStatus(Mesa.StatusMesa status) {
        this.status = status;
    }
}
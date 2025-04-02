package com.apetito.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "mesa_id")
    private Integer mesaId;
    
    @Column(name = "data_hora_reservada")
    private LocalDateTime dataHoraReservada;

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getMesaId() {
        return mesaId;
    }

    public void setMesaId(Integer mesaId) {
        this.mesaId = mesaId;
    }

    public LocalDateTime getDataHoraReservada() {
        return dataHoraReservada;
    }

    public void setDataHoraReservada(LocalDateTime dataHoraReservada) {
        this.dataHoraReservada = dataHoraReservada;
    }
}
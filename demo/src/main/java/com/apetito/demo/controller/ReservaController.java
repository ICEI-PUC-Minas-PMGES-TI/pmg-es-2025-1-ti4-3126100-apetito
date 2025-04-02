package com.apetito.demo.controller;

import com.apetito.demo.model.Reserva;
import com.apetito.demo.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaRepository reservaRepository;

    @PostMapping
    public ResponseEntity<Reserva> criarReserva(@RequestBody Reserva reserva) {
        // Validação simples
        if (reserva.getMesaId() == null || reserva.getMesaId() < 1 || reserva.getMesaId() > 5) {
            return ResponseEntity.badRequest().build();
        }
        
        if (reserva.getDataHoraReservada() == null) {
            return ResponseEntity.badRequest().build();
        }

        Reserva novaReserva = reservaRepository.save(reserva);
        return ResponseEntity.ok(novaReserva);
    }
}
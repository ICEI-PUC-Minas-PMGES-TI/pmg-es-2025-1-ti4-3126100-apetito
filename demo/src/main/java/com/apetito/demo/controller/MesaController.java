package com.apetito.demo.controller;

import com.apetito.demo.model.Mesa;
import com.apetito.demo.repository.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {

    @Autowired
    private MesaRepository mesaRepository;

    @GetMapping
    public List<Mesa> listarMesas() {
        return mesaRepository.findAll();
    }

    @PostMapping("/{id}/ocupar")
    public Mesa ocuparMesa(@PathVariable Long id) {
        Optional<Mesa> mesaOptional = mesaRepository.findById(id);
        if (mesaOptional.isPresent()) {
            Mesa mesa = mesaOptional.get();
            mesa.setStatus("ocupada");
            return mesaRepository.save(mesa);
        }
        return null;
    }

    @PostMapping("/{id}/liberar")
    public Mesa liberarMesa(@PathVariable Long id) {
        Optional<Mesa> mesaOptional = mesaRepository.findById(id);
        if (mesaOptional.isPresent()) {
            Mesa mesa = mesaOptional.get();
            mesa.setStatus("disponível");
            return mesaRepository.save(mesa);
        }
        return null;
    }

    @GetMapping("/disponiveis")
    public List<Mesa> mesasDisponiveis() {
        return mesaRepository.findByStatus("disponível");
    }
}
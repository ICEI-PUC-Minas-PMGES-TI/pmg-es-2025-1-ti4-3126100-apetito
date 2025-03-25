package com.Apetito.Apetito.controller;

import com.Apetito.Apetito.dtos.MesaDTO;
import com.Apetito.Apetito.models.Mesa;
import com.Apetito.Apetito.repositories.MesaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesas")
public class MesaController {

    @Autowired
    private MesaRepository mesaRepository;

    @GetMapping
    public List<Mesa> listarMesas() {
        return mesaRepository.findAll();
    }

    @PostMapping
    public String adicionarMesa(@RequestBody MesaDTO mesaDTO) {
        Mesa mesa = new Mesa(mesaDTO.getNumero(), mesaDTO.getStatus());
        mesaRepository.save(mesa);
        return "Mesa adicionada com sucesso!";
    }

    @PutMapping("/{id}")
    public String atualizarMesa(@PathVariable Long id, @RequestBody MesaDTO mesaDTO) {
        Mesa mesa = mesaRepository.findById(id).orElse(null);
        if (mesa == null) {
            return "Mesa não encontrada!";
        }
        mesa.setNumero(mesaDTO.getNumero());
        mesa.setStatus(mesaDTO.getStatus());
        mesaRepository.save(mesa);
        return "Mesa atualizada com sucesso!";
    }

    @DeleteMapping("/{id}")
    public String deletarMesa(@PathVariable Long id) {
        mesaRepository.deleteById(id);
        return "Mesa removida com sucesso!";
    }
}
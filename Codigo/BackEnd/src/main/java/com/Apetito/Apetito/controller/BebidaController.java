package com.Apetito.Apetito.controller;

import com.Apetito.Apetito.dtos.BebidaDTO;
import com.Apetito.Apetito.models.Bebida;
import com.Apetito.Apetito.repositories.BebidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bebidas")
public class BebidaController {

    @Autowired
    private BebidaRepository bebidaRepository;

    @GetMapping
    public List<Bebida> listarBebidas() {
        return bebidaRepository.findAll();
    }

    @PostMapping
    public String adicionarBebida(@RequestBody BebidaDTO bebidaDTO) {
        Bebida bebida = new Bebida(bebidaDTO.getNome(), bebidaDTO.getDescricao(), bebidaDTO.getPreco());
        bebidaRepository.save(bebida);
        return "Bebida adicionada com sucesso!";
    }

    @PutMapping("/{id}")
    public String atualizarBebida(@PathVariable Long id, @RequestBody BebidaDTO bebidaDTO) {
        Bebida bebida = bebidaRepository.findById(id).orElse(null);
        if (bebida == null) {
            return "Bebida não encontrada!";
        }
        bebida.setNome(bebidaDTO.getNome());
        bebida.setDescricao(bebidaDTO.getDescricao());
        bebida.setPreco(bebidaDTO.getPreco());
        bebidaRepository.save(bebida);
        return "Bebida atualizada com sucesso!";
    }

    @DeleteMapping("/{id}")
    public String deletarBebida(@PathVariable Long id) {
        bebidaRepository.deleteById(id);
        return "Bebida removida com sucesso!";
    }
}
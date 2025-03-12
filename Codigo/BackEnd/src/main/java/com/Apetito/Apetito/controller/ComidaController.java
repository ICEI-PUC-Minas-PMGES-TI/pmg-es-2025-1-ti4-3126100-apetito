package com.Apetito.Apetito.controller;

import com.Apetito.Apetito.dtos.ComidaDTO;
import com.Apetito.Apetito.models.Comida;
import com.Apetito.Apetito.repositories.ComidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comidas")
public class ComidaController {

    @Autowired
    private ComidaRepository comidaRepository;

    @GetMapping
    public List<Comida> listarComidas() {
        return comidaRepository.findAll();
    }

    @PostMapping
    public String adicionarComida(@RequestBody ComidaDTO comidaDTO) {
        Comida comida = new Comida(comidaDTO.getNome(), comidaDTO.getDescricao(), comidaDTO.getPreco());
        comidaRepository.save(comida);
        return "Comida adicionada com sucesso!";
    }

    @PutMapping("/{id}")
    public String atualizarComida(@PathVariable Long id, @RequestBody ComidaDTO comidaDTO) {
        Comida comida = comidaRepository.findById(id).orElse(null);
        if (comida == null) {
            return "Comida não encontrada!";
        }
        comida.setNome(comidaDTO.getNome());
        comida.setDescricao(comidaDTO.getDescricao());
        comida.setPreco(comidaDTO.getPreco());
        comidaRepository.save(comida);
        return "Comida atualizada com sucesso!";
    }

    @DeleteMapping("/{id}")
    public String deletarComida(@PathVariable Long id) {
        comidaRepository.deleteById(id);
        return "Comida removida com sucesso!";
    }
}
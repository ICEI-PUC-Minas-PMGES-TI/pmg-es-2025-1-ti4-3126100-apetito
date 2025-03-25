package com.Apetito.Apetito.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Apetito.Apetito.dtos.AvaliacaoDTO;
import com.Apetito.Apetito.models.Avaliacao;
import com.Apetito.Apetito.repositories.AvaliacaoRepository;

@RestController
@RequestMapping("/avaliacoes")
@CrossOrigin(origins = "*") // Permitir todos os dominios
public class AvaliacaoController {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @PostMapping("/salvar")
    public Avaliacao salvarAvaliacao(@RequestBody AvaliacaoDTO avaliacaoDTO) {
        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setNome(avaliacaoDTO.getNome());
        avaliacao.setComida(avaliacaoDTO.getComida());
        avaliacao.setTempoEspera(avaliacaoDTO.getTempoEspera());
        avaliacao.setAmbiente(avaliacaoDTO.getAmbiente());
        avaliacao.setAtendimento(avaliacaoDTO.getAtendimento());
        avaliacao.setComentario(avaliacaoDTO.getComentario());

        return avaliacaoRepository.save(avaliacao);
    }
}

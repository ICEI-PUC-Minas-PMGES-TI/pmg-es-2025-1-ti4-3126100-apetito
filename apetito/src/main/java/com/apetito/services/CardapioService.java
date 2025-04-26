package com.apetito.services;

import org.springframework.stereotype.Service;

import com.apetito.model.ItemCardapio;
import com.apetito.repository.ItemCardapioRepository;

import java.util.List;

@Service
public class CardapioService {
    private final ItemCardapioRepository itemCardapioRepository;

    public CardapioService(ItemCardapioRepository itemCardapioRepository) {
        this.itemCardapioRepository = itemCardapioRepository;
    }

    public List<ItemCardapio> listarItensDisponiveis() {
        return itemCardapioRepository.findByDisponivelTrue();
    }

    public ItemCardapio buscarItemPorId(Long id) {
        return itemCardapioRepository.findById(id).orElse(null);
    }
}
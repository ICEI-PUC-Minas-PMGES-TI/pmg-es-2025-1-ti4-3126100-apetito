package com.apetito.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apetito.model.ItemCardapio;

import java.util.List;

public interface ItemCardapioRepository extends JpaRepository<ItemCardapio, Long> {
    List<ItemCardapio> findByDisponivelTrue();
}
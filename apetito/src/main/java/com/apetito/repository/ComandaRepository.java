package com.apetito.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.apetito.model.Comanda;

import java.util.List;

public interface ComandaRepository extends JpaRepository<Comanda, Long> {
    List<Comanda> findByStatus(String status);
}
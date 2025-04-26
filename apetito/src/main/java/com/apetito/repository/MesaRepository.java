package com.apetito.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.apetito.model.Mesa;

import java.util.List;

public interface MesaRepository extends JpaRepository<Mesa, Long> {
    List<Mesa> findByOcupadaFalse();
}
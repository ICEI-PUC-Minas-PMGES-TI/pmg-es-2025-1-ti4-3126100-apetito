package com.Apetito.Apetito.repositories;

import com.Apetito.Apetito.models.Comida;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComidaRepository extends JpaRepository<Comida, Long> {}
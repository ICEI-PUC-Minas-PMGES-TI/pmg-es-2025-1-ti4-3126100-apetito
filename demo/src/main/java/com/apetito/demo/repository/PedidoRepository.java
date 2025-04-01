package com.apetito.demo.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.apetito.demo.model.Pedido;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}

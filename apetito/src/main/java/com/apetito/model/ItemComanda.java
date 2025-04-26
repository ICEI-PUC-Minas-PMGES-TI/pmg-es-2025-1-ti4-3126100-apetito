package com.apetito.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ItemComanda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Comanda comanda;
    
    @ManyToOne
    private ItemCardapio itemCardapio;
    
    private Integer quantidade;
    private Double precoUnitario;
    private Double subtotal;
}
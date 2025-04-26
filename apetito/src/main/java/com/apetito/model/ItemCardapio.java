package com.apetito.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ItemCardapio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;
    private String descricao;
    private Double preco;
    private String imagemUrl;
    private boolean disponivel;
}
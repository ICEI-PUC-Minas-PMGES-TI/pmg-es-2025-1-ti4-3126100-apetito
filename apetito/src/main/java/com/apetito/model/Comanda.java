package com.apetito.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Comanda {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Mesa mesa;
    
    private LocalDateTime dataHoraAbertura;
    private LocalDateTime dataHoraFechamento;
    private Double valorTotal;
    private String status; // ABERTA, FECHADA, PAGA
    
    @OneToMany(mappedBy = "comanda", cascade = CascadeType.ALL)
    private List<ItemComanda> itens;
}
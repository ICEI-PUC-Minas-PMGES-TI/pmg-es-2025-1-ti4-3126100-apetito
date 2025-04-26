package com.apetito.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Mesa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Integer numero;
    private boolean ocupada;
}

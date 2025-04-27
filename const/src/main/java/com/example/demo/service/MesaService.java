package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Mesa;
import com.example.demo.repository.MesaRepository;

@Service
public class MesaService {

    @Autowired
    private MesaRepository mesaRepository;

    // Método para alterar o status da mesa
    public void alterarStatus(Long id) {
        Mesa mesa = mesaRepository.findById(id).orElseThrow(() -> new RuntimeException("Mesa não encontrada"));
        mesa.setStatus(mesa.getStatus().equals("livre") ? "ocupado" : "livre");
        mesaRepository.save(mesa);
    }

    // Método para listar todas as mesas
    public List<Mesa> listarMesas() {
        return mesaRepository.findAll();
    }

    // Método para buscar uma mesa por id
    public Mesa buscarMesaPorId(Long id) {
        return mesaRepository.findById(id).orElse(null); // Retorna null se a mesa não for encontrada
    }
}

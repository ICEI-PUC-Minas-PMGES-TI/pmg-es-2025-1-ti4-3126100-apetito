package com.apetito.services;

import org.springframework.stereotype.Service;

import com.apetito.model.Mesa;
import com.apetito.repository.MesaRepository;

import java.util.List;

@Service
public class MesaService {
    private final MesaRepository mesaRepository;

    public MesaService(MesaRepository mesaRepository) {
        this.mesaRepository = mesaRepository;
    }

    public List<Mesa> listarMesasDisponiveis() {
        return mesaRepository.findByOcupadaFalse();
    }

    public Mesa buscarMesaPorId(Long id) {
        return mesaRepository.findById(id).orElse(null);
    }

    public Mesa ocuparMesa(Long id) {
        Mesa mesa = buscarMesaPorId(id);
        if (mesa != null) {
            mesa.setOcupada(true);
            return mesaRepository.save(mesa);
        }
        return null;
    }

    public Mesa liberarMesa(Long id) {
        Mesa mesa = buscarMesaPorId(id);
        if (mesa != null) {
            mesa.setOcupada(false);
            return mesaRepository.save(mesa);
        }
        return null;
    }
}

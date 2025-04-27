package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ItemCardapioRepository itemCardapioRepository;

    @Autowired
    private ItemPedidoRepository itemPedidoRepository;

    @Autowired
    private MesaRepository mesaRepository;

    @Autowired
    private MesaService mesaService; // Injetando o serviço da mesa

    public Pedido criarPedido(String tipoPedido, Long mesaId, String nomeCliente, String enderecoCliente) {
        Pedido pedido = new Pedido();

        if ("mesa".equals(tipoPedido)) {
            // Usando o serviço MesaService para buscar a mesa
            Mesa mesa = mesaService.buscarMesaPorId(mesaId); // Buscar a mesa através do serviço
            if (mesa == null) {
                throw new IllegalArgumentException("Mesa não encontrada.");
            }

            mesa.setStatus("OCUPADO");  // Alterar status da mesa para "ocupado"
            mesaRepository.save(mesa);   // Salvar a mesa com o novo status

            pedido.setMesa(mesa);  // Associar a mesa ao pedido
        } else if ("online".equals(tipoPedido)) {
            pedido.setNomeCliente(nomeCliente);
            pedido.setEnderecoCliente(enderecoCliente);
        }

        return pedidoRepository.save(pedido);  // Salvar o pedido
    }

    public Optional<Pedido> buscarPedido(Long id) {
        return pedidoRepository.findById(id);
    }

    public Pedido adicionarItem(Long pedidoId, Long itemCardapioId, int quantidade) {
        Pedido pedido = pedidoRepository.findById(pedidoId).orElseThrow();
        ItemCardapio itemCardapio = itemCardapioRepository.findById(itemCardapioId).orElseThrow();

        ItemPedido itemPedido = new ItemPedido();
        itemPedido.setPedido(pedido);
        itemPedido.setItemCardapio(itemCardapio);
        itemPedido.setQuantidade(quantidade);

        pedido.getItens().add(itemPedido);
        pedidoRepository.save(pedido);
        return pedido;
    }

    public void removerItem(Long itemPedidoId) {
        itemPedidoRepository.deleteById(itemPedidoId);
    }

    public Pedido finalizarPedido(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId).orElseThrow();
        pedido.setStatus("FINALIZADO");
        return pedidoRepository.save(pedido);
    }

    public double calcularTotal(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId).orElseThrow();
        double total = 0;

        for (ItemPedido itemPedido : pedido.getItens()) {
            total += itemPedido.getItemCardapio().getPreco() * itemPedido.getQuantidade();
        }

        return total;
    }
}

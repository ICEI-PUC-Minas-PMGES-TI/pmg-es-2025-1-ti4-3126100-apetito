package com.example.demo.controller;

import com.example.demo.model.Pedido;
import com.example.demo.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public Pedido criarPedido(
            @RequestParam String tipoPedido,
            @RequestParam(required = false) Long mesaId,  // Mesa ID, não o objeto Mesa
            @RequestParam(required = false) String nomeCliente,
            @RequestParam(required = false) String enderecoCliente) {

        // Agora passando o Long mesaId para o serviço
        return pedidoService.criarPedido(tipoPedido, mesaId, nomeCliente, enderecoCliente);
    }

    @GetMapping("/{id}")
    public Pedido buscarPedido(@PathVariable Long id) {
        return pedidoService.buscarPedido(id).orElseThrow();
    }

    @PostMapping("/{pedidoId}/itens/{itemCardapioId}")
    public Pedido adicionarItem(@PathVariable Long pedidoId, @PathVariable Long itemCardapioId, @RequestParam int quantidade) {
        return pedidoService.adicionarItem(pedidoId, itemCardapioId, quantidade);
    }

    @DeleteMapping("/{pedidoId}/itens/{itemPedidoId}")
    public void removerItem(@PathVariable Long pedidoId, @PathVariable Long itemPedidoId) {
        pedidoService.removerItem(itemPedidoId);
    }

    @PutMapping("/{pedidoId}/finalizar")
    public Pedido finalizarPedido(@PathVariable Long pedidoId) {
        return pedidoService.finalizarPedido(pedidoId);
    }

    @GetMapping("/{pedidoId}/total")
    public double calcularTotal(@PathVariable Long pedidoId) {
        return pedidoService.calcularTotal(pedidoId);
    }
}

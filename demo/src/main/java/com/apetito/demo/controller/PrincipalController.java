package com.apetito.demo.controller;

import com.apetito.demo.model.*;
import com.apetito.demo.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class PrincipalController {

    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private MesaRepository mesaRepository;
    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private ReservaRepository reservaRepository;
    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    // Cadastro de usuário
    @PostMapping("/cadastrar")
    public ResponseEntity<Usuario> cadastrarUsuario(@RequestBody Usuario usuario) {
        Usuario novoUsuario = usuarioRepository.save(usuario);
        return new ResponseEntity<>(novoUsuario, HttpStatus.CREATED);
    }

    // Login de usuário
    @PostMapping("/logar")
    public ResponseEntity<Usuario> logar(@RequestBody Usuario usuario) {
        Optional<Usuario> usuarioOptional = usuarioRepository.findByEmail(usuario.getEmail());
        if (usuarioOptional.isPresent() && usuarioOptional.get().getSenha().equals(usuario.getSenha())) {
            return new ResponseEntity<>(usuarioOptional.get(), HttpStatus.OK);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @RestController
    @RequestMapping("/avaliacoes")
    public class AvaliacaoController {
    
        private final AvaliacaoRepository avaliacaoRepository;
    
        public AvaliacaoController(AvaliacaoRepository avaliacaoRepository) {
            this.avaliacaoRepository = avaliacaoRepository;
        }
    
        @PostMapping
        public ResponseEntity<Avaliacao> criarAvaliacao(@RequestBody Avaliacao avaliacao) {
            Avaliacao novaAvaliacao = avaliacaoRepository.save(avaliacao);
            return new ResponseEntity<>(novaAvaliacao, HttpStatus.CREATED);
        }
    }
    

}

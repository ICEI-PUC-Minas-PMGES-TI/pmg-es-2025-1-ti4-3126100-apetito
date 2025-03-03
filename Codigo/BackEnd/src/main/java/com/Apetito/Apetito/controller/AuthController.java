package com.Apetito.Apetito.controller;

import com.Apetito.Apetito.dtos.LoginRequest;
import com.Apetito.Apetito.dtos.RegisterRequest;
import com.Apetito.Apetito.models.Role;
import com.Apetito.Apetito.models.User;
import com.Apetito.Apetito.repositories.RoleRepository;
import com.Apetito.Apetito.repositories.UserRepository;
import com.Apetito.Apetito.service.CustomUserDetailsService;
import com.Apetito.Apetito.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Usuário já existe!";
        }

        // Verificar se o papel foi informado e é válido
        String roleName = request.getRole();
        if (roleName == null || roleName.isEmpty()) {
            roleName = "ROLE_CLIENTE"; // Papel padrão
        }

        Role role = roleRepository.findByName(roleName);
        if (role == null) {
            return "Papel inválido! Use ROLE_CLIENTE, ROLE_GARÇOM ou ROLE_ADMIN.";
        }

        // Criar o novo usuário
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton(role));

        userRepository.save(user);
        return "Usuário registrado com sucesso como " + roleName + "!";
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        // Carregar o usuário pelo nome de usuário
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getUsername());

        // Verificar se a senha está correta
        if (!passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            return "Credenciais inválidas!";
        }

        // Gerar o token JWT
        return jwtUtil.generateToken(userDetails);
    }
}
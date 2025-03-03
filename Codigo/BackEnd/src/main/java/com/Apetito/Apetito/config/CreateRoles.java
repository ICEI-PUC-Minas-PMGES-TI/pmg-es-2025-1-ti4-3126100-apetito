package com.Apetito.Apetito.config;

import com.Apetito.Apetito.models.Role;
import com.Apetito.Apetito.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class CreateRoles implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByName("ROLE_CLIENTE") == null) {
            roleRepository.save(new Role("ROLE_CLIENTE"));
        }
        if (roleRepository.findByName("ROLE_GARÇOM") == null) {
            roleRepository.save(new Role("ROLE_GARÇOM"));
        }
        if (roleRepository.findByName("ROLE_ADMIN") == null) {
            roleRepository.save(new Role("ROLE_ADMIN"));
        }
    }
}
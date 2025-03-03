package com.Apetito.Apetito.repositories;

import com.Apetito.Apetito.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
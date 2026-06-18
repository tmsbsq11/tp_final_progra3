package com.grupo3.oficio.repository.users;

import com.grupo3.oficio.model.users.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    boolean existsByCorreo(String correo);
    boolean existsByUsername(String username);
    boolean existsByDni(String dni);
    Optional<Cliente> findByCorreo(String correo);
}

package com.grupo3.oficio.repository.users;

import com.grupo3.oficio.model.users.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    boolean existsByCorreo(String correo);
    boolean existsByUsername(String username);
    boolean existsByDni(String dni);
}

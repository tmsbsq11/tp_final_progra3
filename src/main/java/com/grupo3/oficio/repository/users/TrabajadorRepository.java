package com.grupo3.oficio.repository.users;

import com.grupo3.oficio.model.users.Trabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TrabajadorRepository extends JpaRepository<Trabajador, Integer> {
    boolean existsByCorreo(String correo);
    boolean existsByUsername(String username);
    boolean existsByDni(String dni);
    Optional<Trabajador> findByCorreo(String correo);
}

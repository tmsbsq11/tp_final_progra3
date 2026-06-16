package com.grupo3.oficio.repository;

import com.grupo3.oficio.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    boolean existsByNombreIgnoreCase(String nombre);
    List<Categoria> findByIsActiveTrue();
    Optional<Categoria> findByNombreIgnoreCase(String nombre);
}

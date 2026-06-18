package com.grupo3.oficio.repository.users;

import com.grupo3.oficio.model.users.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin,Integer> {
    boolean existsByCorreo(String correo);

    boolean existsByUsername(String username);

    boolean existsByDni(String dni);
}

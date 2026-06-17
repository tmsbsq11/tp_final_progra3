package com.grupo3.oficio.service.users;

import com.grupo3.oficio.model.users.Admin;
import com.grupo3.oficio.repository.users.AdminRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class AdminService {
    AdminRepository adminRepo;

    public AdminService(AdminRepository adminRepo) {
        this.adminRepo = adminRepo;
    }
    //CRUD
    //read
    public List<Admin> mostrarAdmins(){
        return adminRepo.findAll();
    }
    public Admin buscarAdminPorId(Integer id){
        return adminRepo.findById(id).orElseThrow(()->new NoSuchElementException("El id no se encuentra en la base de datos"));
    }
    //create
    public Admin crearAdmin(Admin admin){
        if (admin == null) {
            throw new IllegalArgumentException("El admin no puede ser nulo");
        }
        if (admin.getCorreo() == null || admin.getCorreo().isBlank()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
        if (admin.getUsername() == null || admin.getUsername().isBlank()) {
            throw new IllegalArgumentException("El username es obligatorio");
        }
        if (admin.getPassword() == null || admin.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
        if (admin.getNombre() == null || admin.getNombre().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (admin.getApellido() == null || admin.getApellido().isBlank()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (admin.getDni() == null || !admin.getDni().matches("\\d{7,8}")) {
            throw new IllegalArgumentException("DNI inválido");
        }
        if (adminRepo.existsByCorreo(admin.getCorreo())) {
            throw new IllegalArgumentException("Ya existe un admin con ese correo");
        }
        if (adminRepo.existsByUsername(admin.getUsername())) {
            throw new IllegalArgumentException("Ya existe un admin con ese username");
        }
        if (adminRepo.existsByDni(admin.getDni())) {
            throw new IllegalArgumentException("Ya existe un admin con ese DNI");
        }

        admin.setId(null);
        admin.setFechaCreacion(LocalDateTime.now());

        return adminRepo.save(admin);
    }
    //update
    public Admin actualizarAdmin(Admin admin,Integer id){
        if (admin == null) {
            throw new IllegalArgumentException("El admin no puede ser nulo");
        }
        if (admin.getCorreo() == null || admin.getCorreo().isBlank()) {
            throw new IllegalArgumentException("El correo es obligatorio");
        }
        if (admin.getUsername() == null || admin.getUsername().isBlank()) {
            throw new IllegalArgumentException("El username es obligatorio");
        }
        if (admin.getPassword() == null || admin.getPassword().length() < 8) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 8 caracteres");
        }
        if (adminRepo.existsByCorreo(admin.getCorreo())) {
            throw new IllegalArgumentException("Ya existe un admin con ese correo");
        }
        if (adminRepo.existsByUsername(admin.getUsername())) {
            throw new IllegalArgumentException("Ya existe un admin con ese username");
        } //chequear si necesito validar que no tengan el mismo user o correo con otro al actualizar
        Admin actualizar= adminRepo.findById(id).orElseThrow(()->new NoSuchElementException("No se encontro el id del admin en la base de datos"));
        actualizar.setId(id);
        actualizar.setCorreo(admin.getCorreo());
        actualizar.setUsername(actualizar.getUsername());
        actualizar.setPassword(actualizar.getPassword());
        return adminRepo.save(actualizar);
    }
    //delete
    public void desactivarAdmin(Integer id){
        Admin eliminar=adminRepo.findById(id).orElseThrow(()->new NoSuchElementException("No se encontro el id del admin en la base de datos"));
        eliminar.setIsActive(false);
        adminRepo.save(eliminar);
    }
}

package com.grupo3.oficio.controller.users;

import com.grupo3.oficio.model.users.Admin;
import com.grupo3.oficio.service.users.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {
    AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }
    @GetMapping("/{id}")
    public ResponseEntity<Admin> mostrarAdminPorId(@PathVariable Integer id){
        return ResponseEntity.ok(adminService.buscarAdminPorId(id));
    }

    @GetMapping
    public ResponseEntity<?> mostrarAdmins(){
        return ResponseEntity.ok(adminService.mostrarAdmins());
    }
    @PostMapping
    public ResponseEntity<Admin> crearAdmin(@RequestBody Admin admin){
        return ResponseEntity.ok(adminService.crearAdmin(admin));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Admin> actualizarAdmin(@RequestBody Admin admin,@PathVariable Integer id){
        return ResponseEntity.ok(adminService.actualizarAdmin(admin,id));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> desactivarAdmin(@PathVariable Integer id){
        adminService.desactivarAdmin(id);
        return ResponseEntity.ok("El admin se desactivo correctamente");
    }
}

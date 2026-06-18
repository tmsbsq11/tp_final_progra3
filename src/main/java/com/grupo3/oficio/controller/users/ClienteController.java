package com.grupo3.oficio.controller.users;

import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.service.users.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin("*")
public class ClienteController {
    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) { this.clienteService = clienteService; }


    @GetMapping("/perfil")
    public ResponseEntity<Cliente> miPerfil(Authentication auth) {

        String email = auth.getName();

        return ResponseEntity.ok(
                clienteService.buscarPorEmail(email)
        );
    }
    @PreAuthorize("hasRol('ADMIN')")
    @GetMapping("{id}")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Integer id) {
        try {
            Cliente cliente = clienteService.buscarPorId(id);
            return ResponseEntity.ok(cliente);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PreAuthorize("hasRol('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Cliente>> mostrarTodos() {
        try {
            List<Cliente> lista = clienteService.mostrarTodos();
            return ResponseEntity.ok(lista);
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PreAuthorize("hasRol('ADMIN')")
    @PostMapping
    public ResponseEntity<Cliente> crear(@RequestBody Cliente cliente) {
        try {
            Cliente nuevo = clienteService.crear(cliente);
            return ResponseEntity.ok(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PreAuthorize("hasRol('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Integer id, @RequestBody Cliente cliente) {
        try {
            Cliente actualizado = clienteService.actualizar(id, cliente);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PostMapping("/perfil")
    public ResponseEntity<Cliente> actualizarPerfil(Authentication auth,@RequestBody Cliente cliente) {

        String email = auth.getName();
        return ResponseEntity.ok(
                clienteService.actualizarPerfil(email,cliente)
        );
    }

    @PreAuthorize("hasRol('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> borrar(@PathVariable Integer id) {
        try {
            clienteService.borrar(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

package com.grupo3.oficio.utils.auth;

import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.model.users.User;
import com.grupo3.oficio.repository.users.UserRepository;
import com.grupo3.oficio.utils.auth.dto.LoginDTO;
import com.grupo3.oficio.utils.auth.dto.RegistroDTO;
import com.grupo3.oficio.utils.enums.Rol;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository usuarioRepo;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authManager;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegistroDTO dto) {
        if (usuarioRepo.findByCorreo(dto.getCorreo()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        User usuario = dto.getRol() == Rol.CLIENTE ? new Cliente() : new Trabajador();
        usuario.setNombre(dto.getNombre());
        usuario.setCorreo(dto.getCorreo());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRol(dto.getRol());

        usuarioRepo.save(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado con éxito");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO dto) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword())
        );
        User usuario = usuarioRepo.findByCorreo(dto.getEmail()).get();
        String token = jwtService.generarToken(usuario);
        return ResponseEntity.ok(token);
    }
}

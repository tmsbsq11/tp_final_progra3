package com.grupo3.oficio.utils.auth;

import com.grupo3.oficio.repository.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static com.grupo3.oficio.utils.enums.Rol.ADMIN;
import static com.grupo3.oficio.utils.enums.Rol.CLIENTE;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private UserRepository userRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // --- servicio_reservas: rutas específicas primero ---
                        .requestMatchers(HttpMethod.GET, "/api/servicio_reservas/enviadas/**").hasAnyRole("CLIENTE", "ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/servicio_reservas/recibidas/**").hasRole("TRABAJADOR")
                        .requestMatchers(HttpMethod.GET, "/api/servicio_reservas/estado/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/servicio_reservas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/servicio_reservas/**").hasRole("ADMIN") // catch-all: cubre /{id}
                        .requestMatchers(HttpMethod.PATCH, "/api/servicio_reservas/**").hasRole("TRABAJADOR")
                        .requestMatchers(HttpMethod.POST, "/api/servicio_reservas/**").hasAnyRole("CLIENTE", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/servicio_reservas/**").hasRole("ADMIN")

                        // --- servicios ---
                        .requestMatchers(HttpMethod.GET, "/api/servicios/**").authenticated()
                        .requestMatchers("/api/servicios/**").hasAnyRole("TRABAJADOR", "ADMIN")

                        // --- categorias ---
                        .requestMatchers(HttpMethod.GET, "/api/categorias/**").authenticated()
                        .requestMatchers("/api/categorias/**").hasAnyRole("ADMIN") //ver si conviene q sea auth y despues poner todo menos mostrar categorias para admin

                        // --- clientes / trabajadores / admins ---
                        .requestMatchers("/api/clientes/**").hasAnyRole("ADMIN", "CLIENTE")
                        .requestMatchers("/api/trabajadores/**").hasAnyRole("ADMIN", "TRABAJADOR")
                        .requestMatchers(HttpMethod.GET, "/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // --- notificaciones ---
                        .requestMatchers(HttpMethod.GET, "/api/notificaciones/**").authenticated()
                        .requestMatchers("/api/notificaciones/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return correo -> userRepository.findByCorreo(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

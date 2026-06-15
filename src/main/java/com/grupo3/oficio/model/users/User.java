package com.grupo3.oficio.model.users;

import com.grupo3.oficio.utils.enums.Rol;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name= "usuarios")
@Inheritance(strategy = InheritanceType.JOINED) // Para que no haya una tabla suelta de cada subclase sino que esten relacionadas mediante la de la superclase
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    //credenciales
    private String correo;
    private String username;
    private String password;
    private Boolean isActive;

    //datos
    private String nombre;
    private String apellido;
    private String dni; //api validación ejemplo
    private String direccionFoto;
    private LocalDateTime fechaCreacion;
    //agregar atributo ubicación api (ciudad)

    @Enumerated(EnumType.STRING)
    private Rol rol;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    @Override
    public String getUsername() { return correo; }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return Boolean.TRUE.equals(isActive); }

}

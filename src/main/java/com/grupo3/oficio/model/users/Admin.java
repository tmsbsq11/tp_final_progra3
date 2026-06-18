package com.grupo3.oficio.model.users;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "administradores")
public class Admin extends User{
}

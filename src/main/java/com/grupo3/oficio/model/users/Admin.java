package com.grupo3.oficio.model.users;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "administradores")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Admin extends User{
}

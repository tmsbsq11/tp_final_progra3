import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { Cliente } from '../models/perfil.model';
import { Trabajador } from '../models/perfil.model';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-formulario-perfil',
  styleUrl: './formulario-perfil.css',
  templateUrl: './formulario-perfil.html',
})
export class FormularioPerfil {
@Input() perfil!: Cliente | Trabajador; //recibe los datos del componente padre

@Output() guardar = new EventEmitter<Cliente|Trabajador>();

@Output() cancelar= new EventEmitter<void>();

guardarCambios(){
  this.guardar.emit({
    nombre: this.perfil.nombre,
    apellido: this.perfil.apellido,
    username: this.perfil.username,
    dni: this.perfil.dni,
    id: this.perfil.id,
    fechaCreacion: this.perfil.fechaCreacion,
    puntaje: this.perfil.puntaje,
    descripcion: this.perfil.descripcion,
    correo: this.perfil.correo,

  });
}

cancelarEdicion(){
    this.cancelar.emit();
  }
}

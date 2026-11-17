import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Cliente, Perfil } from '../models/perfil.model';
import { Trabajador } from '../models/perfil.model';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-formulario-perfil',
  styleUrl: './formulario-perfil.css',
  templateUrl: './formulario-perfil.html',
})
export class FormularioPerfil {
@Input() perfil!: Cliente|Trabajador; //recibe los datos del componente padre

@Output() guardar = new EventEmitter<Cliente|Trabajador>();

@Output() cancelar= new EventEmitter<void>();

perfilEditable!: Cliente|Trabajador;

ngOnChanges(changes: SimpleChanges){
if(changes['perfil']&&this.perfil) {
  this.perfilEditable = {...this.perfil}
}
}

guardarCambios(){
  this.guardar.emit({
    ...this.perfilEditable,
  });
}

cancelarEdicion(){
    this.cancelar.emit();
    this.perfilEditable={...this.perfil};
  }

  esTrabajador(): boolean{
    return 'minutosMinimoEntreReservas' in this.perfilEditable;
  }
}

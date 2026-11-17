import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Cliente, Perfil } from '../models/perfil.model';
import { Trabajador } from '../models/perfil.model';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

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

// quita los digitos del nombre o apellido y actualiza el campo con letras
actualizarNombreOApellido(
  campo: 'nombre' | 'apellido', //campo a editar
  valor: string, // el texto ingrersado
  control: NgForm['controls'][string] extends never ? never : NgModel, // saca los numeros
): void {
  const texto = valor.replace(/\p{Nd}/gu, ''); // guarda el texto
  this.perfilEditable[campo] = texto;

  if (texto !== valor) { // entra si no tiene numeros
    control.control.setValue(texto, { emitViewToModelChange: false });
  }
}

// muestra los errores del formulario y envía los datos editados solo si son validos
guardarCambios(formulario: NgForm): void {
  if (formulario.invalid) {
    return;
  }
  this.guardar.emit({ ...this.perfilEditable });
}

cancelarEdicion(){
    this.cancelar.emit();
    this.perfilEditable={...this.perfil};
  }

  esTrabajador(): boolean{
    return 'minutosMinimoEntreReservas' in this.perfilEditable;
  }
}

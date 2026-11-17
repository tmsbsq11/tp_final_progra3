import { Component, inject, OnInit, signal } from '@angular/core';
import { PerfilTrabajadorClient} from '../clients/perfil-trabajador';
import { FormularioPerfil } from '../formulario-perfil/formulario-perfil';
import { Cliente, Trabajador } from '../models/perfil.model';
@Component({
  imports: [FormularioPerfil],
  selector: 'app-perfil-trabajadores',
  styleUrl: './perfil-trabajadores.css',
  templateUrl: './perfil-trabajadores.html',
})
export class PerfilTrabajadores implements OnInit {
  private readonly client=inject(PerfilTrabajadorClient);
  
  editando=signal<boolean>(false);
  trabajadorPerfil=signal<Trabajador|null>(null);
  ngOnInit(){
    this.client.obtenerPerfil().subscribe(
      (trabajador)=>
        this.trabajadorPerfil.set(trabajador)
    );
    this.editando.set(false);
  }
  guardarPerfil(datos: Cliente|Trabajador){
    if(!('minutosMinimoEntreReservas' in datos)) return;//para que solo funcione con tranajadores
    this.client.actualizarPerfil(datos).subscribe({
      next: (trabajadorActualizado) => {
        this.trabajadorPerfil.set(trabajadorActualizado);
        this.editando.set(false);
      },
      error: () => alert('Error al actualizar el perfil')
    });
  }
  cancelar(){
    this.editando.set(false);
  }
  }

import { Component, inject, OnInit, signal } from '@angular/core';
import { PerfilTrabajadorClient} from '../clients/perfil-trabajador';
import { FormularioPerfil } from '../formulario-perfil/formulario-perfil';
import { Cliente, Trabajador } from '../models/perfil.model';
import { ReseniasList } from '../../resenias/resenias-list/resenias-list';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

@Component({
  imports: [FormularioPerfil, ReseniasList, FormsModule],
  selector: 'app-perfil-trabajadores',
  styleUrl: '../perfil-clientes/perfilClientes.css',
  templateUrl: './perfil-trabajadores.html',
})
export class PerfilTrabajadores implements OnInit {
  private readonly client=inject(PerfilTrabajadorClient);
  
  editando=signal<boolean>(false);
  trabajadorPerfil=signal<Trabajador|null>(null);
  direccion = '';
  guardandoUbicacion = signal(false);
  mensajeUbicacion = signal('');

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

  guardarUbicacion(): void {
    const trabajador = this.trabajadorPerfil();
    const direccion = this.direccion.trim();

    if (!trabajador || this.guardandoUbicacion()) {
      return;
    }

    if (!direccion) {
      this.mensajeUbicacion.set(
        'Ingresá una dirección con calle, altura y ciudad.'
      );
      return;
    }

    this.mensajeUbicacion.set('');
    this.guardandoUbicacion.set(true);

    this.client
      .actualizarUbicacion(Number(trabajador.id), direccion)
      .pipe(
        finalize(() => this.guardandoUbicacion.set(false))
      )
      .subscribe({
        next: () => {
          this.mensajeUbicacion.set(
            'Ubicación guardada correctamente.'
          );
        },
        error: () => {
          this.mensajeUbicacion.set(
            'No se pudo guardar la ubicación. Revisá la dirección e intentá nuevamente.'
          );
        },
      });
  }
}

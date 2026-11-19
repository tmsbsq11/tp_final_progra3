import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ClienteServicios } from '../../../servicios/client/cliente-servicios';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';
@Component({
  imports: [RouterLink,],
  selector: 'app-servicio-pendiente-list',
  styleUrl: './servicio-pendiente-list.css',
  templateUrl: './servicio-pendiente-list.html',
})
export class ServicioPendienteList {
  client = inject(ClienteServicios);//ver si hago funcion q solo devuelve pendientes en el cliente

  private recargar = signal(0);

  servicios = toSignal(
    toObservable(this.recargar).pipe(
      switchMap(() => this.client.obtenerServicios())
    ),
    { initialValue: [] }
  );

  serviciosFiltrados = computed(() =>
    this.servicios().filter(s => s.isApproved === false)
  );
  validar(id: number | string | undefined) {
    return this.client.validarServicio(id).subscribe({
      next: () => {
        this.recargar.update(valor=>valor+1);
      },
      error: () => {
        console.error('error al validar el servicio')
      }
    });
  }
}

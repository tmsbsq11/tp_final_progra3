import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ClienteServicios } from '../../client/cliente-servicios';
import { Servicio } from '../../model/servicio.model';

@Component({
  selector: 'app-trabajador-detail',
  imports: [RouterLink],
  templateUrl: './trabajador-detail.html',
  styleUrl: './trabajador-detail.css',
})
export class TrabajadorDetail implements OnInit {
  publicaciones = signal<Servicio[]>([]);
  trabajador = computed(() => this.publicaciones()[0]?.trabajador); //computed hace que trabajador() devuelva los datos del trabajador de la primera publicación, o undefined si la lista está vacía.
  cargando = signal(false);
  mensaje = signal('');

  constructor(
    private route: ActivatedRoute,
    private clienteServicios: ClienteServicios,
  ) {}

  ngOnInit(): void {
    const idTrabajador = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(idTrabajador) || idTrabajador <= 0) {
      this.mensaje.set('El trabajador seleccionado no es válido.');
      return;
    }

    this.cargando.set(true);

    this.clienteServicios.buscarServicios()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: servicios => {
          const propios = servicios.filter(
            servicio => servicio.trabajador.id === idTrabajador,
          );

          this.publicaciones.set(propios);

          if (propios.length === 0) {
            this.mensaje.set('Este trabajador no tiene publicaciones disponibles.');
          }
        },
        error: () => this.mensaje.set('No se pudo cargar la ficha del trabajador.'),
      });
  }
}
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ClienteServicios } from '../../client/cliente-servicios';
import { Servicio } from '../../model/servicio.model';

@Component({
  selector: 'app-trabajador-list',
  imports: [RouterLink],
  templateUrl: './trabajador-list.html',
  styleUrl: './trabajador-list.css',
})
export class TrabajadorList implements OnInit {
  servicios = signal<Servicio[]>([]);
  cargando = signal(false);
  mensaje = signal('');

  //computed sirve para agrupar los servicios por trabajador, devuelve un array de objetos con el trabajador y sus publicaciones
  trabajadores = computed(() => {
    const grupos = new Map<number, {
      trabajador: Servicio['trabajador'];
      publicaciones: Servicio[];
    }>();

    for (const servicio of this.servicios()) {
      const trabajador = servicio.trabajador;
      const grupo = grupos.get(trabajador.id);

      if (grupo) {
        grupo.publicaciones.push(servicio);
      } else {
        grupos.set(trabajador.id, {
          trabajador,
          publicaciones: [servicio],
        });
      }
    }

    return Array.from(grupos.values());
  });

  constructor(
    private route: ActivatedRoute,
    private clienteServicios: ClienteServicios,
  ) {}

  ngOnInit(): void {

    const busqueda = this.route.snapshot.queryParamMap.get('busqueda') ?? '';

    const idCategoria = Number(
        this.route.snapshot.queryParamMap.get('idCategoria')
    );

    if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
      this.mensaje.set('El oficio seleccionado no es válido.');
      return;
    }

    this.cargando.set(true);

    this.clienteServicios.buscarServicios('', idCategoria)
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: servicios => this.servicios.set(servicios),
        error: () => this.mensaje.set('No se pudieron cargar los trabajadores.'),
      });
  }
}
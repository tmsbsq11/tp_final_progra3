import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ClienteServicios } from '../../client/cliente-servicios';
import { Servicio } from '../../model/servicio.model';
import { ReseniaRecibida } from '../../../resenias/model/resenia.model';
import { ReseniasService } from '../../../resenias/service/resenias.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-trabajador-detail',
  imports: [RouterLink, DatePipe],
  templateUrl: './trabajador-detail.html',
  styleUrl: './trabajador-detail.css',
})
export class TrabajadorDetail implements OnInit {

  resenias = signal<ReseniaRecibida[]>([]);
  cargandoResenias = signal(false);
  mensajeResenias = signal('');
  publicaciones = signal<Servicio[]>([]);
  trabajador = computed(() => this.publicaciones()[0]?.trabajador); //computed hace que trabajador() devuelva los datos del trabajador de la primera publicación, o undefined si la lista está vacía.
  cargando = signal(false);
  mensaje = signal('');
  rutaVolver = '/servicios'; // guarda la ruta a la que se debe volver desde el detalle del trabajador, por defecto es /servicios
  filtrosVolver: Record<string, string> = {}; //guarda los filtros de búsqueda y categoría para volver al listado de servicios con los mismos filtros aplicados

  porcentajePuntaje = computed(() => {
    const resenias = this.resenias();

    if (resenias.length === 0) return null;

    const total = resenias.reduce((suma, resenia) => suma + resenia.puntaje, 0);
    return Math.round((total / (resenias.length * 5)) * 100);
  });
  
  constructor(
    private route: ActivatedRoute,
    private clienteServicios: ClienteServicios,
    private reseniasService: ReseniasService
  ) {}

  ngOnInit(): void {

    const params = this.route.snapshot.queryParamMap;
    const volverCategoria = params.get('volverCategoria');

    if (volverCategoria) {
      this.rutaVolver = '/trabajadores';
      this.filtrosVolver = { idCategoria: volverCategoria };
    } else {
      const busqueda = params.get('busqueda');
      const idCategoria = params.get('idCategoria');

      if (busqueda) this.filtrosVolver['busqueda'] = busqueda;
      if (idCategoria) this.filtrosVolver['idCategoria'] = idCategoria;
    }

    const idTrabajador = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(idTrabajador) || idTrabajador <= 0) {
      this.mensaje.set('El trabajador seleccionado no es válido.');
      return;
    }

    this.cargando.set(true);

    this.cargandoResenias.set(true);

    this.reseniasService.listarDelTrabajador(idTrabajador)
      .pipe(finalize(() => this.cargandoResenias.set(false)))
      .subscribe({
        next: resenias => this.resenias.set(resenias),
        error: () => this.mensajeResenias.set('No se pudieron cargar las reseñas.'),
      });

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
import { Component, computed, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ClienteServicios } from '../../client/cliente-servicios';
import { Servicio } from '../../model/servicio.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-postulaciones',
  imports: [RouterLink],
  templateUrl: './mis-postulaciones.html',
  styleUrl: './mis-postulaciones.css',
})

export class MisPostulaciones implements OnInit {
  publicaciones = signal<Servicio[]>([]);
  cargando = signal(false);
  mensaje = signal('');
  textoFiltro = signal('');
  categoriaFiltro = signal('');
  bajaEnCurso = signal(false);
  mensajeBaja = signal('');

  constructor(
    private clienteServicios: ClienteServicios,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    const idTrabajador = this.authService.getUserId();

    if (idTrabajador === null) {
      this.mensaje.set('Volvé a iniciar sesión como trabajador.');
      return;
    }

    this.mensaje.set('');
    this.cargando.set(true);

    this.clienteServicios.obtenerServicios()
      .pipe(finalize(() => this.cargando.set(false))) //te permite agregarle operadores a la consulta,finalize() para apagar el mensaje de “Cargando…” cuando termina la petición
      .subscribe({
        next: servicios => {
          this.publicaciones.set(
            servicios.filter(servicio => servicio.trabajador.id === idTrabajador),
          );
        },
        error: () => {
          this.mensaje.set('No se pudieron cargar tus postulaciones.');
        },
      });
  }

  darDeBaja(publicacion: Servicio): void {
    const id = Number(publicacion.id);
    const idTrabajador = this.authService.getUserId();

    if (
      this.bajaEnCurso() ||
      !publicacion.isActive ||
      idTrabajador === null ||
      publicacion.trabajador.id !== idTrabajador ||
      this.authService.getUserRole()?.toLowerCase() !== 'trabajador' ||
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return;
    }

    if (!window.confirm(`¿Querés dar de baja ${publicacion.titulo}?`)) {
      return;
    }

    this.mensajeBaja.set('');
    this.bajaEnCurso.set(true);

    this.clienteServicios.eliminarServicio(id)
      .pipe(finalize(() => this.bajaEnCurso.set(false)))
      .subscribe({
        next: () => this.cargar(),
        error: ({ status }) => {
          this.mensajeBaja.set(
            status === 403
              ? 'Tu cuenta no tiene permiso para dar de baja esta postulación.'
              : 'No se pudo dar de baja la postulación.',
          );
        },
      });
}

  categoriasFiltro = computed(() => {
    const categorias = this.publicaciones().map(servicio =>
      [servicio.categoria.id, servicio.categoria.nombre] as const,
    );

    return Array.from(new Map(categorias));
  });

  publicacionesFiltradas = computed(() => { //computed() sirve para filtrar las publicaciones según el texto y la categoría seleccionada
    const texto = this.textoFiltro().trim().toLowerCase();
    const categoriaId = this.categoriaFiltro();

    return this.publicaciones().filter(servicio => {
      const coincideTexto =
        servicio.titulo.toLowerCase().includes(texto) ||
        (servicio.descripcion ?? '').toLowerCase().includes(texto);

      const coincideCategoria =
        categoriaId === '' || String(servicio.categoria.id) === categoriaId;

      return coincideTexto && coincideCategoria;
    });
  });

}
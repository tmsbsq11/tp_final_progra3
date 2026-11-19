import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { FavoritoDetalle } from '../model/favorito.model';
import { FavoritosService } from '../service/favoritos.service';

@Component({
  selector: 'app-favoritos-list',
  imports: [RouterLink],
  templateUrl: './favoritos-list.html',
  styleUrl: './favoritos-list.css',
})
export class FavoritosList implements OnInit {

  favoritos = signal<FavoritoDetalle[]>([]);
  cargando = signal(false);
  mensaje = signal('');
  aviso = signal('');
  numeroAviso = signal(0);
  textoFiltro = signal('');
  categoriaFiltro = signal('');
  disponibilidadFiltro = signal('');

  constructor(
    private authService: AuthService,
    private favoritosService: FavoritosService,
  ) {}

  categorias = computed(() => {
    const categorias = new Map<number, string>();

    for (const favorito of this.favoritos()) {
      const categoria = favorito.servicio?.categoria;

      if (categoria) {
        categorias.set(categoria.id, categoria.nombre);
      }
    }

    // arma la lista de categorias y las ordena por nombre
    return Array.from(categorias, ([id, nombre]) => ({ id, nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  });

  // combina la busqueda, la categoria y la disponibilidad
  visibles = computed(() => {
    const texto = this.textoFiltro().trim().toLocaleLowerCase();
    const categoria = this.categoriaFiltro();
    const disponibilidad = this.disponibilidadFiltro();

    return this.favoritos().filter(favorito => {
      const servicio = favorito.servicio;

      // junta los datos en minuscula para buscar por servicio o trabajador
      const datos = [
        servicio?.titulo,
        servicio?.descripcion,
        servicio?.trabajador.nombre,
        servicio?.trabajador.apellido,
      ].join(' ').toLocaleLowerCase();

      const coincideTexto = !texto || datos.includes(texto);
      const coincideCategoria =
        !categoria || String(servicio?.categoria.id) === categoria;

      // revisa si el favorito coincide con la disponibilidad elegida
      const coincideDisponibilidad =
        !disponibilidad ||
        (disponibilidad === 'disponible'
          ? this.estaDisponible(favorito)
          : !this.estaDisponible(favorito));

      return coincideTexto && coincideCategoria && coincideDisponibilidad;
    });
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.mensaje.set('');

    if (this.authService.getUserRole()?.toLowerCase() !== 'cliente') {
      this.mensaje.set('Iniciá sesión como cliente para consultar tus favoritos.');
      return;
    }

    this.cargando.set(true);

    // si falla antes de iniciar la consulta muestra un mensage
    try {
      this.favoritosService.listarConDetalle()
        .pipe(finalize(() => this.cargando.set(false)))
        .subscribe({
          next: favoritos => this.favoritos.set(favoritos),
          error: () => {
            this.mensaje.set('No se pudieron cargar tus favoritos.');
          },
        });
    } catch {
      this.cargando.set(false);
      this.mensaje.set('No se pudieron leer los favoritos del navegador.');
    }
  }

  // comprueba que la postulacion este activa y aprobada
  estaDisponible(favorito: FavoritoDetalle): boolean {
    return favorito.servicio?.isActive === true &&
      favorito.servicio.isApproved === true;
  }

  quitar(favorito: FavoritoDetalle): void {
    this.numeroAviso.update(numero => numero + 1);
    this.aviso.set('');

    // si falla al quitar el favorito muestra un mensage
    try {
      this.favoritosService.quitar(favorito.idServicio);

      this.favoritos.update(lista =>
        lista.filter(item => item.idServicio !== favorito.idServicio)
      );

      this.aviso.set('Postulación quitada de favoritos.');
    } catch {
      this.aviso.set('No se pudo quitar la postulación de favoritos.');
    }
  }

  limpiarFiltros(): void {
    this.textoFiltro.set('');
    this.categoriaFiltro.set('');
    this.disponibilidadFiltro.set('');
  }

  private cierreAviso = effect((limpiar) => {
    this.numeroAviso();

    if (!this.aviso()) {
      return;
    }

    const temporizador = setTimeout(() => {
      this.aviso.set('');
    }, 3000);

    limpiar(() => clearTimeout(temporizador));
  });
}
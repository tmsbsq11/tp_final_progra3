import { Component, OnInit, OnDestroy, computed, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { CategoriasService } from '../../../categorias/categorias.service';
import { ClienteServicios } from '../../../servicios/client/cliente-servicios';
import { Servicio } from '../../../servicios/model/servicio.model';

type Estado = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

@Component({
  selector: 'app-servicio-pendiente-list',
  imports: [],
  templateUrl: './servicio-pendiente-list.html',
  styleUrl: './servicio-pendiente-list.css',
})
export class ServicioPendienteList implements OnInit, OnDestroy {

  servicios = signal<Servicio[]>([]);
  rechazados = signal<string[]>([]);
  solapa = signal<Estado>('PENDIENTE');
  cargando = signal(false);
  procesando = signal(false);
  mensaje = signal('');
  aviso = signal('');
  numeroAviso = signal(0);
  private temporizadorAviso?: ReturnType<typeof setTimeout>;

  private clave = '';

  constructor(
    private client: ClienteServicios,
    private authService: AuthService,
    private categoriasService: CategoriasService
  ) {}

  serviciosFiltrados = computed(() =>
    this.servicios().filter(s => this.estadoDe(s) === this.solapa())
  );

  ngOnInit(): void {
    const id = this.authService.getUserId();
    const rol = this.authService.getUserRole()?.toLowerCase();

    if (rol !== 'admin' || id == null) {
      this.mensaje.set('Iniciá sesión como administrador.');
      return;
    }

    this.clave = 'oficiosya-rechazos-v1:' + id;
    this.cargar();
  }

  cargar(): void {
    if (!this.clave || this.cargando() || this.procesando()) {
      return;
    }

    this.mensaje.set('');

    try {
      const datos: unknown = JSON.parse(
        localStorage.getItem(this.clave) ?? '[]'
      );

      if (
        !Array.isArray(datos) ||
        !datos.every(id => typeof id === 'string')
      ) {
        throw new Error('Formato inválido');
      }

      this.rechazados.set(datos);
    } catch {
      this.mensaje.set(
        'No se pudieron leer los rechazos guardados en este navegador.'
      );
      return;
    }

    this.cargando.set(true);

    forkJoin({
      servicios: this.client.obtenerServicios(),
      categorias: this.categoriasService.listar()
    }).subscribe({
      next: ({ servicios, categorias }) => {
        const ids = categorias
          .filter(c => c.needsCertification)
          .map(c => c.id);

        this.servicios.set(
          servicios.filter(s => ids.includes(Number(s.categoria.id)))
        );

        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.mensaje.set('No se pudieron cargar las postulaciones.');
      }
    });
  }

  estadoDe(servicio: Servicio): Estado {
    if (servicio.isApproved === true) {
      return 'ACEPTADA';
    }

    if (this.rechazados().includes(String(servicio.id))) {
      return 'RECHAZADA';
    }

    return 'PENDIENTE';
  }

  cantidad(estado: Estado): number {
    return this.servicios().filter(
      s => this.estadoDe(s) === estado
    ).length;
  }

  aceptar(servicio: Servicio): void {
    if (
      !this.clave ||
      this.procesando() ||
      this.estadoDe(servicio) !== 'PENDIENTE'
    ) {
      return;
    }

    const id = Number(servicio.id);

    if (!Number.isInteger(id) || id <= 0) {
      this.mostrarAviso('La postulación no tiene un identificador válido.');
      return;
    }

    this.cerrarAviso();
    this.procesando.set(true);

    this.client.validarServicio(id).subscribe({
      next: () => {
        this.servicios.update(lista =>
          lista.map(s =>
            Number(s.id) === id
              ? { ...s, isApproved: true }
              : s
          )
        );

        this.procesando.set(false);
        this.mostrarAviso('Postulación aceptada.');
      },
      error: () => {
        this.procesando.set(false);
        this.mostrarAviso('No se pudo aceptar la postulación.');
      }
    });
  }

  rechazar(servicio: Servicio): void {
    if (
      !this.clave ||
      this.procesando() ||
      this.estadoDe(servicio) !== 'PENDIENTE'
    ) {
      return;
    }

    const id = Number(servicio.id);

    if (!Number.isInteger(id) || id <= 0) {
      this.mostrarAviso('La postulación no tiene un identificador válido.');
      return;
    }

    if (!confirm('¿Querés rechazar esta postulación?')) {
      return;
    }

    try {
      const lista = [...this.rechazados(), String(id)];

      localStorage.setItem(this.clave, JSON.stringify(lista));
      this.rechazados.set(lista);

      this.mostrarAviso('Postulación rechazada.');
    } catch {
      this.mostrarAviso('No se pudo rechazar la postulación.');
    }
  }

  mostrarAviso(texto: string): void {
  clearTimeout(this.temporizadorAviso);

    this.aviso.set(texto);
    this.numeroAviso.update(numero => numero + 1);

    this.temporizadorAviso = setTimeout(() => {
      this.aviso.set('');
    }, 3000);
  }

  cerrarAviso(): void {
    clearTimeout(this.temporizadorAviso);
    this.aviso.set('');
  }

  ngOnDestroy(): void {
    clearTimeout(this.temporizadorAviso);
  }
}
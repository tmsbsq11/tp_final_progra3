import { Component, computed, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Notificacion } from '../../../features/notificaciones/models/notificacion.models';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  cuentaAbierta = signal(false);
  notificacionesAbiertas = signal(false);

  notificaciones = signal<Notificacion[]>([]);
  cargando = signal(false);
  mensaje = signal('');

  constructor(
    public authService: AuthService,
    private http: HttpClient
  ) {}

  get rol(): string {
    return this.authService.getUserRole()?.toLowerCase() ?? '';
  }

  abrirCuenta(): void {
    this.notificacionesAbiertas.set(false);
    this.cuentaAbierta.set(!this.cuentaAbierta());
  }

  abrirNotificaciones(): void {
    this.cuentaAbierta.set(false);

    this.notificacionesAbiertas.set(
      !this.notificacionesAbiertas()
    );

    if (this.notificacionesAbiertas() && !this.cargando()) {
      this.cargarNotificaciones();
    }
  }

  cerrarMenus(): void {
    this.cuentaAbierta.set(false);
    this.notificacionesAbiertas.set(false);
  }

  cerrarDesdeAfuera(
    evento: MouseEvent,
    encabezado: HTMLElement
  ): void {
    if (!encabezado.contains(evento.target as Node)) {
      this.cerrarMenus();
    }
  }

  cargarNotificaciones(): void {
    const idCuenta = this.authService.getUserId();

    this.cargando.set(true);
    this.mensaje.set('');
    this.notificaciones.set([]);

    this.http.get<Notificacion[]>('/api/notificaciones')
      .subscribe({
        next: (lista) => {
          if (idCuenta === this.authService.getUserId()) {
            lista.sort((a, b) =>
              b.fechaCreacion.localeCompare(a.fechaCreacion)
            );

            this.notificaciones.set(lista);
          }
          this.cargando.set(false);
        },
        error: () => {
          this.cargando.set(false);

          this.mensaje.set(
            'No se pudieron cargar las notificaciones.'
          );
        }
      });
  }

  destinoNotificacion(notificacion: Notificacion): string {
    if (
      notificacion.tipoNotificacion === 'RESERVA' ||
      notificacion.tipoNotificacion === 'RECORDATORIO'
    ) {
      if (this.rol === 'cliente') {
        return '/mis-reservas';
      }

      if (this.rol === 'trabajador') {
        return '/reservas-recibidas';
      }
    }

    if (notificacion.tipoNotificacion === 'RESENIA') {
      if (this.rol === 'cliente') {
        return '/perfil/cliente';
      }

      if (this.rol === 'trabajador') {
        return '/perfil/trabajador';
      }
    }

    if (notificacion.tipoNotificacion === 'VALIDACION') {
      if (this.rol === 'trabajador') {
        return '/mis-postulaciones';
      }

      if (this.rol === 'admin') {
        return '/admin/pendientes';
      }
    }

    return '/notificaciones';
  }

}
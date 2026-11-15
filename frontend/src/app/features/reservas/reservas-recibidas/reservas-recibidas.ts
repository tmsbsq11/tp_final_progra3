import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { EstadoReserva, ReservaDetalle } from '../reserva.model';
import { ReservasService } from '../reservas.service';

type Filtro = EstadoReserva | 'TODAS';

@Component({
  selector: 'app-reservas-recibidas',
  imports: [DatePipe],
  templateUrl: './reservas-recibidas.html',
})
export class ReservasRecibidas implements OnInit {
  private reservasService = inject(ReservasService);

  reservas = signal<ReservaDetalle[]>([]);
  filtro = signal<Filtro>('TODAS');
  cargando = signal(true);
  mensaje = signal('');
  aviso = signal('');
  procesando = signal<number | null>(null); // id de la reserva en proceso

  etiquetas: Record<EstadoReserva, string> = {
    PENDIENTE: 'Pendiente',
    APROBADO: 'Aprobada',
    RECHAZADO: 'Rechazada o cancelada',
    FINALIZADO: 'Finalizada',
  };

  // Filtra por estado y ordena de la más próxima a la más lejana
  visibles = computed(() => {
    const filtro = this.filtro();
    const lista = this.reservas().filter(
      (r) => filtro === 'TODAS' || r.estadoReserva === filtro
    );
    return [...lista].sort((a, b) => a.inicio.localeCompare(b.inicio));
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.mensaje.set('');
    this.reservasService
      .reservasRecibidas()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (lista) => this.reservas.set(lista),
        error: ({ status }) =>
          this.mensaje.set(
            status === 401 || status === 403
              ? 'Necesitás iniciar sesión como trabajador para ver tus reservas.'
              : 'No se pudieron cargar las reservas.'
          ),
      });
  }

  cambiarFiltro(evento: Event): void {
    this.filtro.set((evento.target as HTMLSelectElement).value as Filtro);
  }

  aceptar(reserva: ReservaDetalle): void {
    this.cambiarEstado(reserva, 'aceptar');
  }

  rechazar(reserva: ReservaDetalle): void {
    if (!confirm(`¿Rechazar la reserva de ${reserva.cliente.nombre}?`)) return;
    this.cambiarEstado(reserva, 'rechazar');
  }

  private cambiarEstado(reserva: ReservaDetalle, accion: 'aceptar' | 'rechazar'): void {
    if (this.procesando() !== null) return;
    this.aviso.set('');
    this.procesando.set(reserva.id);

    const peticion =
      accion === 'aceptar'
        ? this.reservasService.aceptarReserva(reserva.id)
        : this.reservasService.rechazarReserva(reserva.id);

    peticion.pipe(finalize(() => this.procesando.set(null))).subscribe({
      next: () => {
        this.aviso.set(accion === 'aceptar' ? 'Reserva aceptada.' : 'Reserva rechazada.');
        // Aceptar puede rechazar otras pendientes que se pisan: se recarga todo
        this.cargar();
      },
      error: ({ error }) =>
        this.aviso.set(error?.message ?? 'No se pudo actualizar la reserva.'),
    });
  }
}
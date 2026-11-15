import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { EstadoReserva, ReservaDetalle } from '../reserva.model';
import { ReservasService } from '../reservas.service';

type Filtro = EstadoReserva | 'TODAS';

@Component({
  selector: 'app-mis-reservas',
  imports: [DatePipe],
  templateUrl: './mis-reservas.html',
})
export class MisReservas implements OnInit {
  private reservasService = inject(ReservasService);

  reservas = signal<ReservaDetalle[]>([]);
  filtro = signal<Filtro>('TODAS');
  cargando = signal(true);
  mensaje = signal('');
  aviso = signal('');
  cancelando = signal<number | null>(null); // id de la reserva que se está cancelando

  etiquetas: Record<EstadoReserva, string> = {
    PENDIENTE: 'Pendiente',
    APROBADO: 'Aprobada',
    RECHAZADO: 'Rechazada o cancelada',
    FINALIZADO: 'Finalizada',
  };

  // Filtra por estado y ordena de la más reciente a la más antigua
  visibles = computed(() => {
    const filtro = this.filtro();
    const lista = this.reservas().filter(
      (r) => filtro === 'TODAS' || r.estadoReserva === filtro
    );
    return [...lista].sort((a, b) => b.inicio.localeCompare(a.inicio));
  });

  ngOnInit(): void {
    this.reservasService
      .misReservas()
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: (lista) => this.reservas.set(lista),
        error: ({ status }) =>
          this.mensaje.set(
            status === 401 || status === 403
              ? 'Necesitás iniciar sesión como cliente para ver tus reservas.'
              : 'No se pudieron cargar tus reservas.'
          ),
      });
  }

  cambiarFiltro(evento: Event): void {
    this.filtro.set((evento.target as HTMLSelectElement).value as Filtro);
  }

  cancelar(reserva: ReservaDetalle): void {
    if (this.cancelando() !== null) return;
    if (!confirm(`¿Cancelar la reserva de "${reserva.servicio.titulo}"?`)) return;

    this.aviso.set('');
    this.cancelando.set(reserva.id);

    this.reservasService
      .cancelarReserva(reserva.id)
      .pipe(finalize(() => this.cancelando.set(null)))
      .subscribe({
        next: () => {
          this.reservas.update((lista) =>
            lista.map((r): ReservaDetalle =>
              r.id === reserva.id ? { ...r, estadoReserva: 'RECHAZADO' } : r
            )
          );
          this.aviso.set('Reserva cancelada.');
        },
        error: ({ error }) =>
          this.aviso.set(error?.message ?? 'No se pudo cancelar la reserva.'),
      });
  }
}
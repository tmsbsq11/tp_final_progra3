import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Servicio } from '../servicios/model/servicio.model';
import { ReservaDetalle, ReservaNueva } from './reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly http = inject(HttpClient);

  obtenerServicio(id: number) {
    return this.http.get<Servicio>(`/api/servicios/${id}`);
  }

  // Devuelve el cliente logueado; de ahí sale el idCliente
  obtenerPerfilCliente() {
    return this.http.get<{ id: number }>('/api/clientes/perfil');
  }

  crear(reserva: ReservaNueva) {
    return this.http.post<unknown>('/api/servicio_reservas', reserva);
  }

  misReservas() {
    return this.http.get<ReservaDetalle[]>('/api/servicio_reservas/enviadas');
  }

  cancelarReserva(id: number) {
    return this.http.patch<unknown>(`/api/servicio_reservas/rechazar/${id}`, null);
  }

  reservasRecibidas() {
    return this.http.get<ReservaDetalle[]>('/api/servicio_reservas/recibidas');
  }
  
  aceptarReserva(id: number) {
    return this.http.patch<unknown>(`/api/servicio_reservas/aceptar/${id}`, null);
  }
  
  rechazarReserva(id: number) {
    return this.http.patch<unknown>(`/api/servicio_reservas/rechazar/${id}`, null);
  }

  finalizarReserva(id: number) {
  return this.http.patch<ReservaDetalle>(
    `/api/servicio_reservas/finalizar/${id}`,
    null
  );
}
}
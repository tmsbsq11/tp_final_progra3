import { Injectable } from '@angular/core';
// transforma los datos cuando llega la respuesta de spring
import { map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ClienteServicios } from '../../servicios/client/cliente-servicios';
import { Favorito, FavoritoDetalle } from '../model/favorito.model';

@Injectable({ providedIn: 'root' })
export class FavoritosService {

  constructor(
    private authService: AuthService,
    private clienteServicios: ClienteServicios,
  ) {}

  listar(): Favorito[] {
    const datos = localStorage.getItem(this.obtenerClave());

    if (datos === null) {
      return [];
    }

    // convierte el texto guardado en la lista de favoritos
    const favoritos: unknown = JSON.parse(datos);

    if (!Array.isArray(favoritos)) {
      throw new Error('Los favoritos guardados tienen un formato inválido.');
    }

    for (const favorito of favoritos) {
      if (
        favorito === null ||
        typeof favorito !== 'object' || // comprueba si el elemento es distinto de un objeto
        !Number.isInteger(favorito.idServicio) ||
        favorito.idServicio <= 0
      ) {
        throw new Error('Los favoritos guardados tienen datos inválidos.');
      }
    }

    return favoritos;
  }

  // busca los datos actuales de las postulaciones que guardaste
  listarConDetalle() {
    this.obtenerClave();

    return this.clienteServicios.obtenerServicios().pipe(
      map(servicios => {
        const serviciosPorId = new Map(
          servicios.map(servicio => [Number(servicio.id), servicio])
        );

        return this.listar().map((favorito): FavoritoDetalle => ({
          idServicio: favorito.idServicio,
          servicio: serviciosPorId.get(favorito.idServicio) ?? null,
        }));
      })
    );
  }

  // agrega la postulacion si todavia no esta en favoritos
  agregar(idServicio: number): void {
    if (!Number.isInteger(idServicio) || idServicio <= 0) {
      throw new Error('La postulación indicada no es válida.');
    }

    const favoritos = this.listar();
    const existe = favoritos.some(
      favorito => favorito.idServicio === idServicio
    );

    if (existe) {
      return;
    }

    // agrega la postulacion al final de la lista
    favoritos.push({ idServicio });

    // guarda la lista actualizada en el navegador
    localStorage.setItem(
      this.obtenerClave(),
      JSON.stringify(favoritos)
    );
  }

  quitar(idServicio: number): void {
    const favoritos = this.listar().filter(
      favorito => favorito.idServicio !== idServicio
    );

    // guarda la lista despues de quitar el favorito
    localStorage.setItem(
      this.obtenerClave(),
      JSON.stringify(favoritos)
    );
  }

  // usa una clave diferente para cada cliente
  private obtenerClave(): string {
    const idCliente = this.authService.getUserId();
    const rol = this.authService.getUserRole()?.toLowerCase();

    if (idCliente === null || rol !== 'cliente') {
      throw new Error('Iniciá sesión como cliente para usar favoritos.');
    }

    return `oficiosya-favoritos-v1:${idCliente}`;
  }
}
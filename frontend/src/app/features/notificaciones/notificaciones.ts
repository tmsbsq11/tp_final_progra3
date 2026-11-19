import { Component, inject, OnInit, signal } from '@angular/core';
import { NotificacionClient } from './clients/notificacion-client';
import { Notificacion } from './models/notificacion.models';

@Component({
  imports: [],
  selector: 'app-notificaciones',
  styleUrl: './notificaciones.css',
  templateUrl: './notificaciones.html',
})
export class Notificaciones implements OnInit{
  private readonly clientNotificacion=inject(NotificacionClient);

  notificaciones=signal<Notificacion[]>([]);
  cargando= signal<boolean>(false);
  error=signal<string|null>(null);
  ngOnInit(){
    this.cargarNotificaciones();
  }

  cargarNotificaciones(){
    this.cargando.set(true);
    this.error.set(null);

    this.clientNotificacion.obtenerNotificaciones().subscribe({
      next: (data)=> {
        this.notificaciones.set(data);
        this.cargando.set(false);
      },
      error: ()=> {
        this.error.set('No se pudieron cargar las notificaciones');
        this.cargando.set(false);
      }
    });
  }

}

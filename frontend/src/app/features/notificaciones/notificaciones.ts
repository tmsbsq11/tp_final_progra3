import { Component, inject, OnInit, signal,computed } from '@angular/core';
import { NotificacionClient } from './clients/notificacion-client';
import { Notificacion } from './models/notificacion.models';
import { DatePipe } from '@angular/common';
import { TipoNotificacion } from './models/notificacion.models';
@Component({
  imports: [DatePipe],
  selector: 'app-notificaciones',
  styleUrl: './notificaciones.css',
  templateUrl: './notificaciones.html',
})
export class Notificaciones implements OnInit{
  private readonly clientNotificacion=inject(NotificacionClient);

  notificaciones=signal<Notificacion[]>([]);
  cargando= signal<boolean>(false);
  error=signal<string|null>(null);
  tipoNotificacion=signal<TipoNotificacion|''>('');
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
  notificacionesFiltradas = computed(() => {
  const tipo = this.tipoNotificacion();

  if (!tipo) {
    return this.notificaciones();
  }

  return this.notificaciones().filter(
    notificacion => notificacion.tipoNotificacion === tipo
  );
});

}

import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { ClienteServicios } from '../client/cliente-servicios';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  imports: [],
  selector: 'app-lista-servicios',
  styleUrl: './lista-servicios.css',
  templateUrl: './lista-servicios.html',
})
export class ListaServicios {
  private cliente= inject(ClienteServicios);
  private servicios= toSignal(this.cliente.obtenerServicios());

}

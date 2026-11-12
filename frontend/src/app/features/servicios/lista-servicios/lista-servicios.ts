import { Component, OnInit, signal } from '@angular/core';
import { inject } from '@angular/core';
import { ClienteServicios } from '../client/cliente-servicios';
import { toSignal } from '@angular/core/rxjs-interop';
import { Servicio } from '../model/servicio.model';
import { finalize } from 'rxjs';
@Component({
  imports: [],
  selector: 'app-lista-servicios',
  styleUrl: './lista-servicios.css',
  templateUrl: './lista-servicios.html',
})
export class ListaServicios implements OnInit {

  servicios = signal<Servicio[]>([]); //inicializo la señal con un array vacio para que no tire error 
  cargado = signal(false); //inicializo la señal con false pq todavia no se cargaron los servicios
  mensaje = signal(''); //inicializo la señal con un string vacio
  categorias = signal<{id : number; nombre : string}[]>([]); //inicializo la señal vacia
  mensajeCategoria = signal(''); 

  constructor (
    private clienteServicios: ClienteServicios //para poder usar los metodos del cliente de servicios
  ){}

  ngOnInit(): void {
    this.cargarServicios();
    this.cargarCategorias();
  }

  cargarServicios(busqueda = '', idCatalogo ?: number) : void{
    this.cargado.set(true);
    
    this.clienteServicios.buscarServicios(busqueda, idCatalogo)
    .pipe(finalize(() => this.cargado.set(false))) //cuando termina de cargar, cambia el estado de cargado a false
    .subscribe({
      next : (servicios) => {
        this.servicios.set(servicios);
      },
      error : ({status}) => {
        if(status === 401 || status === 403){
          this.mensaje.set('Se necesita una sesión autorizada para consultar el catalogo.');
        }else{
          this.mensaje.set('No se pudo cargar el catalogo.');
        }
      }
    });
  }

  cargarCategorias() : void{
    this.clienteServicios.obtenerCategorias()
    .subscribe({
      next : (categorias) => {
        this.categorias.set(categorias);
      },
      error : () => {
        this.mensajeCategoria.set('No se pudieron cargar las categorias.');
      }
    });
  }
}

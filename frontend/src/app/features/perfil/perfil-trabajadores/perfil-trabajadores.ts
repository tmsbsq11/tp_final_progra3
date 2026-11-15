import { Component, inject, OnInit, signal } from '@angular/core';
import { PerfilTrabajadorClient, Trabajador } from '../clients/perfil-trabajador';

@Component({
  imports: [],
  selector: 'app-perfil-trabajadores',
  styleUrl: './perfil-trabajadores.css',
  templateUrl: './perfil-trabajadores.html',
})
export class PerfilTrabajadores implements OnInit {
  private readonly client=inject(PerfilTrabajadorClient);
  
  trabajadorPerfil=signal<Trabajador|null>(null);
  ngOnInit(){
    this.client.obtenerPerfil().subscribe(
      (trabajador)=>
        this.trabajadorPerfil.set(trabajador)
    );

  }
}

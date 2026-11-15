import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Cliente, ClientePerfilClient } from '../clients/perfil-client';
@Component({
  imports: [],
  selector: 'app-perfilClientes',
  styleUrl: './perfilClientes.css',
  templateUrl: './perfilClientes.html',
})
export class PerfilClientes implements OnInit {
    public authService=inject(AuthService);
    private clienteClient=inject(ClientePerfilClient);

    clientePerfil=signal<Cliente|null>(null);
     
      ngOnInit(){
      this.clienteClient.obtenerClientePerfil().subscribe({
        next: (cliente) =>{
          this.clientePerfil.set(cliente);
        },
        error:()=>
          alert('Cliente no encontrado')
      });
      
     }

  }
    


import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ClientePerfilClient } from '../clients/perfil-client';
import { FormularioPerfil } from '../formulario-perfil/formulario-perfil';
import { Cliente, Perfil } from '../models/perfil.model';
import { ClientesClient } from '../clients/clientes-client';
@Component({
  imports: [FormularioPerfil],
  selector: 'app-perfilClientes',
  styleUrl: './perfilClientes.css',
  templateUrl: './perfilClientes.html',
})
export class PerfilClientes implements OnInit {
    public authService=inject(AuthService);
    private clienteClient=inject(ClientePerfilClient);
  
    clientePerfil=signal<Cliente|null>(null);
    editando=signal<boolean>(false);


     
      ngOnInit(){
      this.clienteClient.obtenerClientePerfil().subscribe({
        next: (cliente) =>{
          this.clientePerfil.set(cliente);
        },
        error:()=>
          alert('Cliente no encontrado')
      });
      this.editando.set(false);
     }
     guardarPerfil(datos: Cliente): void {
    // Acá debe llamarse al método de actualización de tu clienteClient.
    // Ejemplo: actualizarClientePerfil(datos)

    this.clienteClient.actualizarPerfil(datos).subscribe({
      next: (clienteActualizado) => {
        this.clientePerfil.set(clienteActualizado);
        this.editando.set(false);
      },
      error: () => alert('Error al actualizar el perfil')
    });
  }
  cancelar(){
    this.editando.set(false);
  }
     }
     
  
    


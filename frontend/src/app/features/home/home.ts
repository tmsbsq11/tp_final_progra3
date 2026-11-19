import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { iconoCategoria } from '../../shared/diseno';
import { TrabajadorServicio } from '../servicios/client/trabajador-servicio';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  oficios = [
    'Plomería',
    'Electricidad',
    'Gas',
    'Jardinería',
    'Pintura'
  ];

  iconoCategoria = iconoCategoria;

  constructor(
    public authService: AuthService,
    private trabajadorService: TrabajadorServicio,
    private router: Router
  ) {}

  ngOnInit(): void {
    const rol = this.authService.getUserRole()?.toLowerCase();
    const id = this.authService.getUserId();

    if (rol === 'trabajador' && id != null) {
      this.comprobarPerfil(id);
    }
  }

  comprobarPerfil(id: number): void {
    this.trabajadorService.getTrabajadorById(id).subscribe({
      next: (trabajador) => {
        if (trabajador.minutosMinimoEntreReservas == null) {
          alert('Completá los minutos mínimos entre reservas en Editar datos para poder recibir reservas.');

          this.router.navigate(['/perfil/trabajador']);
        }
      },
      error: () => {
        alert('No se pudo comprobar el perfil del trabajador.');
      }
    });
  }

}
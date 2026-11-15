import { Component, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { ClienteServicios } from '../../client/cliente-servicios';
import { Servicio } from '../../model/servicio.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mis-postulaciones',
  imports: [RouterLink],
  templateUrl: './mis-postulaciones.html',
  styleUrl: './mis-postulaciones.css',
})

export class MisPostulaciones implements OnInit {
  publicaciones = signal<Servicio[]>([]);
  cargando = signal(false);
  mensaje = signal('');

  constructor(
    private clienteServicios: ClienteServicios,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    const idTrabajador = this.authService.getUserId();

    if (idTrabajador === null) {
      this.mensaje.set('Volvé a iniciar sesión como trabajador.');
      return;
    }

    this.mensaje.set('');
    this.cargando.set(true);

    this.clienteServicios.obtenerServicios()
      .pipe(finalize(() => this.cargando.set(false))) //te permite agregarle operadores a la consulta,finalize() para apagar el mensaje de “Cargando…” cuando termina la petición
      .subscribe({
        next: servicios => {
          this.publicaciones.set(
            servicios.filter(servicio => servicio.trabajador.id === idTrabajador),
          );
        },
        error: () => {
          this.mensaje.set('No se pudieron cargar tus postulaciones.');
        },
      });
  }
}
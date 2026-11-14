import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { Servicio } from '../servicios/model/servicio.model';
import { ReservasService } from '../reservas/reservas.service';

@Component({
  selector: 'app-reserva-form',
  imports: [ReactiveFormsModule],
  templateUrl: './reserva-form.html'
})
export class ReservaForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private reservasService = inject(ReservasService);

  servicio = signal<Servicio | null>(null);
  idCliente = signal<number | null>(null);
  cargando = signal(true);
  enviando = signal(false);
  mensaje = signal('');
  hoy = new Date().toLocaleDateString('sv-SE'); // yyyy-MM-dd en hora local

  formulario = this.fb.nonNullable.group({
    fechaReservada: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    forkJoin({
      servicio: this.reservasService.obtenerServicio(id),
      cliente: this.reservasService.obtenerPerfilCliente(),
    })
      .pipe(finalize(() => this.cargando.set(false)))
      .subscribe({
        next: ({ servicio, cliente }) => {
          this.servicio.set(servicio);
          this.idCliente.set(cliente.id);
        },
        error: ({ status }) => {
          this.mensaje.set(
            status === 401 || status === 403
              ? 'Necesitás iniciar sesión como cliente para reservar.'
              : 'No se pudo cargar el servicio.'
          );
        },
      });
  }

  reservar(): void {
    const servicio = this.servicio();
    const idCliente = this.idCliente();
    if (!servicio || idCliente === null || this.formulario.invalid || this.enviando()) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { fechaReservada, horaInicio, horaFin } = this.formulario.getRawValue();
    if (horaFin <= horaInicio) {
      this.mensaje.set('La hora de fin debe ser posterior a la de inicio.');
      return;
    }

    this.mensaje.set('');
    this.enviando.set(true);

    this.reservasService
      .crear({
        idCliente,
        idTrabajador: servicio.trabajador.id,
        idServicio: Number(servicio.id),
        fechaReservada,
        horaInicio,
        horaFin,
      })
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: () => {
          this.mensaje.set('Reserva creada.');
          this.formulario.reset();
        },
        error: ({ status, error }) => {
          this.mensaje.set(
            error?.message ??
              (status === 401 || status === 403
                ? 'No tenés permiso para reservar con esta sesión.'
                : 'No se pudo crear la reserva.')
          );
        },
      });
  }
}
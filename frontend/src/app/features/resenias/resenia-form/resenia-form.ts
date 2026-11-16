import { Component, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ReservaDetalle } from '../../reservas/reserva.model';
import { ReservasService } from '../../reservas/reservas.service';
import { ReseniasService } from '../service/resenias.service';

@Component({
  selector: 'app-resenia-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './resenia-form.html',
  styleUrl: './resenia-form.css',
})
export class ReseniaForm implements OnInit {

    formulario!: FormGroup;
    rol = signal<'cliente' | 'trabajador' | null>(null);
    reserva = signal<ReservaDetalle | null>(null);
    cargando = signal(false);
    enviando = signal(false);
    mensaje = signal('');
    idReseniaCreada = signal<number | null>(null);

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private authService: AuthService,
        private reservasService: ReservasService,
        private reseniasService: ReseniasService,
    ) {}

    ngOnInit(): void {

        this.formulario = this.fb.group({
        puntaje: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
        comentario: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
        });

        const rol = this.authService.getUserRole()?.toLowerCase();

        if (rol !== 'cliente' && rol !== 'trabajador') {
        this.mensaje.set('Iniciá sesión como cliente o trabajador para enviar una reseña.');
        return;
        }

        this.rol.set(rol);

        const idReserva = Number(this.route.snapshot.paramMap.get('idReserva'));

        if (!Number.isInteger(idReserva) || idReserva <= 0) {
        this.mensaje.set('La reserva indicada no es válida.');
        return;
        }

        //cada rol consulta las reservas que le corresponden.
        const consulta = rol === 'cliente'
        ? this.reservasService.misReservas()
        : this.reservasService.reservasRecibidas();

        this.cargando.set(true);

        //carga las reservas de tu cuenta y busca la reserva finalizada que elegiste para escribir la reseña
        consulta
        .pipe(finalize(() => this.cargando.set(false)))
        .subscribe({
            next: reservas => {
            const seleccionada = reservas.find(
                reserva => reserva.id === idReserva &&
                reserva.estadoReserva === 'FINALIZADO',
            );

            if (seleccionada) {
                this.reserva.set(seleccionada);
            } else {
                this.mensaje.set('Elegí una reserva finalizada de tu cuenta.');
            }
            },
            error: () => this.mensaje.set('No se pudo cargar la reserva.'),
        });
    }

    onSubmit(): void {
        const reserva = this.reserva();
        const rol = this.rol();

        if (!reserva || !rol || this.enviando() || this.idReseniaCreada() !== null) {
        return;
        }

        const idUsuario = this.authService.getUserId();
        const rolActual = this.authService.getUserRole()?.toLowerCase();

        if (idUsuario === null || rolActual !== rol) {
        this.mensaje.set('Volvé a iniciar sesión para enviar la reseña.');
        return;
        }

        const idAutor = rol === 'cliente' ? reserva.cliente.id : reserva.trabajador.id;

        if (idUsuario !== idAutor) {
        this.mensaje.set('Solo podés reseñar desde una reserva de tu cuenta.');
        return;
        }

        const { puntaje, comentario } = this.formulario.getRawValue();
        const texto = comentario.trim();
        this.formulario.patchValue({ comentario: texto });

        if (this.formulario.invalid || !Number.isInteger(puntaje) || !texto) {
        this.formulario.markAllAsTouched();
        this.mensaje.set('Elegí un puntaje del 1 al 5 y escribí un comentario.');
        return;
        }

        this.mensaje.set('');
        this.enviando.set(true);

        this.reseniasService.crear({
        idCliente: reserva.cliente.id,
        idTrabajador: reserva.trabajador.id,
        puntaje,
        comentario: texto,
        direccionResenia: rol === 'cliente'
            ? 'CLIENTEATRABAJADOR'
            : 'TRABAJADORACLIENTE',
        })
        .pipe(finalize(() => this.enviando.set(false)))
        .subscribe({
            next: resenia => {
            this.idReseniaCreada.set(resenia.id);
            this.mensaje.set('Reseña enviada.');
            },
            error: () => this.mensaje.set('No se pudo enviar la reseña.'),
        });
    }
}
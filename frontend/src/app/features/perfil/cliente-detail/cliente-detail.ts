import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ReseniaRecibida } from '../../resenias/model/resenia.model';
import { ReseniasService } from '../../resenias/service/resenias.service';
import { ReservaDetalle } from '../../reservas/reserva.model';
import { ReservasService } from '../../reservas/reservas.service';

@Component({
    selector: 'app-cliente-detail',
    imports: [RouterLink, DatePipe],
    templateUrl: './cliente-detail.html',
    styleUrl: '../../servicios/trabajadores/trabajador-detail/trabajador-detail.css',
})
export class ClienteDetail implements OnInit {

    cliente = signal<ReservaDetalle['cliente'] | null>(null);
    resenias = signal<ReseniaRecibida[]>([]);
    
    // calcula el porcentaje promedio de las reseñas y devuelve null si todavia no hay ninguna
    porcentajePuntaje = computed(() => {
    const resenias = this.resenias();

    if (resenias.length === 0) {
        return null;
    }

    const total = resenias.reduce((suma, resenia) => suma + resenia.puntaje, 0);
    return Math.round((total / (resenias.length * 5)) * 100);
    });

    cargando = signal(false);
    cargandoResenias = signal(false);
    mensaje = signal('');
    mensajeResenias = signal('');

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private reservasService: ReservasService,
        private reseniasService: ReseniasService,
    ) {}

    ngOnInit(): void {

        // solo deja continuar si la cuenta tiene el rol de trabajador
        if (this.authService.getUserRole()?.toLowerCase() !== 'trabajador') {
        this.mensaje.set('Iniciá sesión como trabajador para ver esta ficha.');
        return;
        }

        const idReserva = Number(this.route.snapshot.paramMap.get('idReserva'));

        // comprueba que el ID de la reserva en la URL sea un entero positivo
        if (!Number.isInteger(idReserva) || idReserva <= 0) {
        this.mensaje.set('La reserva indicada no es válida.');
        return;
        }

        this.cargando.set(true);

        this.reservasService.reservasRecibidas()
        .pipe(finalize(() => this.cargando.set(false)))
        .subscribe({
            next: reservas => {
            const reserva = reservas.find(r => r.id === idReserva);

            if (!reserva) {
                this.mensaje.set('No se encontró esa reserva entre las que recibiste.');
                return;
            }

            this.cliente.set(reserva.cliente);
            this.cargarResenias(reserva.cliente.id);
            },
            error: () => this.mensaje.set('No se pudo cargar la ficha del cliente.'),
        });
    }

    cargarResenias(idCliente: number): void {
        this.cargandoResenias.set(true);

        this.reseniasService.listarDelCliente(idCliente)
        .pipe(finalize(() => this.cargandoResenias.set(false)))
        .subscribe({
            next: resenias => this.resenias.set(resenias),
            error: () => this.mensajeResenias.set('No se pudieron cargar las reseñas.'),
        });
    }
}
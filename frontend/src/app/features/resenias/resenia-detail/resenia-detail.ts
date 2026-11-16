import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ReseniaRecibida } from '../model/resenia.model';
import { ReseniasService } from '../service/resenias.service';

@Component({
  selector: 'app-resenia-detail',
  imports: [DatePipe, RouterLink],
  templateUrl: './resenia-detail.html',
  styleUrl: './resenia-detail.css',
})
export class ReseniaDetail implements OnInit {
    
    resenia = signal<ReseniaRecibida | null>(null);
    cargando = signal(false);
    mensaje = signal('');

    puedeSolicitarRevision = computed(() => {
        const detalle = this.resenia();

        if (!detalle || !this.authService.estaAutenticado()) return false;

        const idUsuario = this.authService.getUserId();
        if (idUsuario === null) return false;

        if (detalle.direccionResenia === 'CLIENTEATRABAJADOR') {
        return detalle.trabajador?.id === idUsuario;
        }

        if (detalle.direccionResenia === 'TRABAJADORACLIENTE') {
        return detalle.cliente?.id === idUsuario;
        }

        return false;
    });

    constructor(
        private route: ActivatedRoute,
        private reseniasService: ReseniasService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        const idResenia = Number(this.route.snapshot.paramMap.get('idResenia'));

        if (!Number.isInteger(idResenia) || idResenia <= 0) {
        this.mensaje.set('La reseña indicada no es válida.');
        return;
        }

        this.cargando.set(true);

        this.reseniasService.obtenerPorId(idResenia)
        .pipe(finalize(() => this.cargando.set(false)))
        .subscribe({
            next: resenia => this.resenia.set(resenia),
            error: () => this.mensaje.set('No se pudo cargar la reseña.'),
        });
    }
}
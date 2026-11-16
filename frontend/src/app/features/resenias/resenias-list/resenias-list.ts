import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ReseniaRecibida } from '../model/resenia.model';
import { ReseniasService } from '../service/resenias.service';

@Component({
  selector: 'app-resenias-list',
  imports: [DatePipe, RouterLink],
  templateUrl: './resenias-list.html',
  styleUrl: './resenias-list.css',
})
export class ReseniasList implements OnInit {

    resenias = signal<ReseniaRecibida[]>([]);
    cargando = signal(false);
    mensaje = signal('');

    constructor(
        private route: ActivatedRoute,
        private reseniasService: ReseniasService,
    ) {}

    ngOnInit(): void {
        
        const idTrabajador = Number(this.route.snapshot.paramMap.get('idTrabajador'));

        if (!Number.isInteger(idTrabajador) || idTrabajador <= 0) {
        this.mensaje.set('El trabajador indicado no es válido.');
        return;
        }

        this.cargando.set(true);

        this.reseniasService.listarDelTrabajador(idTrabajador)
        .pipe(finalize(() => this.cargando.set(false)))
        .subscribe({
            next: resenias => this.resenias.set(resenias),
            error: () => this.mensaje.set('No se pudieron cargar las reseñas.'),
        });
    }
}
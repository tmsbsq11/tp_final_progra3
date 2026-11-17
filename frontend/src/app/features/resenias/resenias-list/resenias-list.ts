import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';import { ActivatedRoute, RouterLink } from '@angular/router';
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

    // recibe el ID y el tipo de perfil para consultar las reseñas que recibio
    @Input() perfil?: { id: string | number; tipo: 'cliente' | 'trabajador' };
    resenias = signal<ReseniaRecibida[]>([]);
    cargando = signal(false);
    mensaje = signal('');

    constructor(
        private route: ActivatedRoute,
        private reseniasService: ReseniasService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.perfil?.id ?? this.route.snapshot.paramMap.get('idTrabajador'));

        if (!Number.isInteger(id) || id <= 0) {
            this.mensaje.set('El perfil indicado no es válido.');
            return;
        }

        // consulta las reseñas recibidas por el cliente o el trabajador según el tipo de perfil
        const consulta = this.perfil?.tipo === 'cliente'
            ? this.reseniasService.listarDelCliente(id)
            : this.reseniasService.listarDelTrabajador(id);

        this.cargando.set(true);

        consulta
            .pipe(finalize(() => this.cargando.set(false)))
            .subscribe({
                next: resenias => this.resenias.set(resenias),
                error: () => this.mensaje.set('No se pudieron cargar las reseñas.'),
            });
    }
}
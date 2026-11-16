import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { NuevaResenia, ReseniaRecibida } from '../model/resenia.model';

@Injectable({ providedIn: 'root' })
export class ReseniasService {

    private readonly url = '/api/resenias';
    private http = inject(HttpClient);

    crear(resenia: NuevaResenia) {
        return this.http.post<ReseniaRecibida>(this.url, resenia);
    }

    listarDelTrabajador(idTrabajador: number) {
        return this.http.get<ReseniaRecibida[]>(`${this.url}/trabajador/${idTrabajador}`);
    }

    obtenerPorId(idResenia: number) {
        return this.http.get<ReseniaRecibida>(`${this.url}/${idResenia}`);
    }
}
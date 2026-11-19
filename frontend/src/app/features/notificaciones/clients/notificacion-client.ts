import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Notificacion } from '../models/notificacion.models';
import { AuthService } from '../../../core/services/auth.service';

@Service()
export class NotificacionClient {
    private readonly http=inject(HttpClient);
private readonly authService=inject(AuthService);

    private readonly url='/api/notificaciones'

    obtenerNotificaciones(){
        return this.http.get<Notificacion[]>(this.url);
    }
}

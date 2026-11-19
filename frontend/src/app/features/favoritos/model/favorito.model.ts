import { Servicio } from '../../servicios/model/servicio.model';

// dato que guardamos en la pagona 
export interface Favorito {
  idServicio: number;
}

// datos actuales que se muestran en la pantalla
export interface FavoritoDetalle extends Favorito {
  servicio: Servicio | null;
}
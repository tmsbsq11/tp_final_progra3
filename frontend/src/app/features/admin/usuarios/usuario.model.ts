// UsuarioSalidaDTO (backend). El password NO esta a proposito.
export interface UsuarioAdmin {
  id: number;
  correo: string;
  username: string | null; // el backend devuelve el correo (revisar DTOs)
  nombre: string | null;
  apellido: string | null;
  dni: string | null;
  direccionFoto: string | null;
  fechaCreacion: string | null;
  isActive: boolean | null;
  rol: 'CLIENTE' | 'TRABAJADOR' | 'ADMIN';
}

// ClienteSalidaDTO
export interface ClienteAdmin extends UsuarioAdmin {
  puntaje: number | null;
  descripcion: string | null;
}

// TrabajadorSalidaDTO
export interface TrabajadorAdmin extends UsuarioAdmin {
  puntaje: number | null;
  descripcion: string | null;
  minutosMinimoEntreReservas: number | null;
  latitud: number | null;
  longitud: number | null;
}

// Lo que se envia al crear o editar. username va igual al correo pq el backend todavia lo pide
export interface ClienteFormulario {
  nombre: string;
  apellido: string;
  correo: string;
  username: string;
  dni: string;
  descripcion: string;
  password?: string; // cuando editas si falta no se cambia
}

export interface TrabajadorFormulario extends ClienteFormulario {
  minutosMinimoEntreReservas: number;
}

export const API_BASE = '/api';

export const ROUTES = {
  login: '#/login',
  register: '#/register',
  home: '#/',
};

export const NAV_BY_ROLE = {
  CLIENTE: [
    { hash: '#/servicios', label: 'Servicios' },
    { hash: '#/reservas', label: 'Mis reservas' },
    { hash: '#/resenias', label: 'Reseñas' },
    { hash: '#/perfil-cliente', label: 'Perfil' },
  ],
  TRABAJADOR: [
    { hash: '#/mis-servicios', label: 'Mis servicios' },
    { hash: '#/perfil-trabajador', label: 'Perfil' },
  ],
  ADMIN: [
    { hash: '#/admin/categorias', label: 'Categorías' },
    { hash: '#/admin/servicios', label: 'Servicios' },
    { hash: '#/admin/reservas', label: 'Reservas' },
    { hash: '#/admin/notificaciones', label: 'Notificaciones' },
    { hash: '#/admin/usuarios', label: 'Usuarios' },
  ],
};

export const DEFAULT_ROUTE = {
  CLIENTE: '#/servicios',
  TRABAJADOR: '#/mis-servicios',
  ADMIN: '#/admin/categorias',
};

export const ESTADOS_RESERVA = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'FINALIZADO'];

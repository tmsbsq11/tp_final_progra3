import { restoreSession } from './auth.js';
import { initRouter, onRoute, navigate } from './router.js';
import { initAuthViews } from './views/auth.js';
import {
  renderServicios,
  renderReservas,
  renderPerfilCliente,
  renderResenias,
  initClienteEvents,
} from './views/cliente.js';
import {
  renderMisServicios,
  renderPerfilTrabajador,
  initTrabajadorEvents,
} from './views/trabajador.js';
import {
  renderAdminCategorias,
  renderAdminServicios,
  renderAdminReservas,
  renderAdminNotificaciones,
  renderAdminUsuarios,
  initAdminEvents,
} from './views/admin.js';

function registerRoutes() {
  onRoute('#/login', async () => {});
  onRoute('#/register', async () => {});

  onRoute('#/servicios', renderServicios);
  onRoute('#/reservas', renderReservas);
  onRoute('#/perfil-cliente', renderPerfilCliente);
  onRoute('#/resenias', renderResenias);

  onRoute('#/mis-servicios', renderMisServicios);
  onRoute('#/perfil-trabajador', renderPerfilTrabajador);

  onRoute('#/admin/categorias', renderAdminCategorias);
  onRoute('#/admin/servicios', renderAdminServicios);
  onRoute('#/admin/reservas', renderAdminReservas);
  onRoute('#/admin/notificaciones', renderAdminNotificaciones);
  onRoute('#/admin/usuarios', renderAdminUsuarios);
}

async function bootstrap() {
  initAuthViews();
  initClienteEvents();
  initTrabajadorEvents();
  initAdminEvents();
  registerRoutes();
  initRouter();

  await restoreSession();
  await navigate();
}

bootstrap();

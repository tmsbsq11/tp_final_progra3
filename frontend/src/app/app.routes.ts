import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ListaServicios } from './features/servicios/lista-servicios/lista-servicios';
import { ReservaForm } from './features/reservas/reserva-form';
import { authGuard } from './core/guards/auth.guard';
import { TrabajadorList } from './features/servicios/trabajadores/trabajador-list/trabajador-list';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin/clientes', canActivate: [adminGuard], loadComponent: () => import('./features/admin/usuarios/clientes-lista').then(m => m.ClientesLista) },
  { path: 'admin/trabajadores', canActivate: [adminGuard], loadComponent: () => import('./features/admin/usuarios/trabajadores-lista').then(m => m.TrabajadoresLista) },
  { path: 'admin/categorias', loadComponent: () => import('./features/categorias/categoria-form/categoria-form').then(m => m.CategoriaForm), canActivate: [authGuard] },
  { path: 'admin/categorias/lista', loadComponent: () => import('./features/categorias/categorias-lista/categorias-lista').then(m => m.CategoriasLista), canActivate: [authGuard] },
  { path: 'servicios/:id/reservar', loadComponent: () => import('./features/reservas/reserva-form').then(m => m.ReservaForm), canActivate: [authGuard], data: { roles: ['cliente'] } },  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register)},
  { path: 'perfil/cliente', loadComponent: ()=> import('./features/perfil/perfil-clientes/perfilClientes').then(m=>m.PerfilClientes)},
  { path: 'perfil/trabajador',loadComponent: ()=> import('./features/perfil/perfil-trabajadores/perfil-trabajadores').then(m=>m.PerfilTrabajadores)},
  { path: 'servicios', component: ListaServicios, canActivate: [authGuard], data: { roles: ['cliente', 'admin'] } },
  { path: 'trabajadores', component: TrabajadorList, canActivate: [authGuard], data: { roles: ['cliente'] } },
  { path: 'trabajadores/:id', loadComponent: () => import('./features/servicios/trabajadores/trabajador-detail/trabajador-detail').then(m => m.TrabajadorDetail), canActivate: [authGuard], data: { roles: ['cliente', 'admin'] } },
  { path: 'mis-reservas', loadComponent: () => import('./features/reservas/mis-reservas/mis-reservas').then(m => m.MisReservas), canActivate: [authGuard] },
  { path: 'reservas-recibidas', loadComponent: () => import('./features/reservas/reservas-recibidas/reservas-recibidas').then(m => m.ReservasRecibidas), canActivate: [authGuard] },
  { path: 'mis-postulaciones', loadComponent: () => import('./features/servicios/postulaciones/mis-postulaciones/mis-postulaciones').then(m => m.MisPostulaciones), canActivate: [authGuard]},
  { path: 'mis-postulaciones/nueva', loadComponent: () => import('./features/servicios/postulaciones/postulacion-form/postulacion-form').then(m => m.PostulacionForm), canActivate: [authGuard]},
  { path: 'mis-postulaciones/:id/editar', loadComponent: () =>import('./features/servicios/postulaciones/postulacion-form/postulacion-form').then(m => m.PostulacionForm), canActivate: [authGuard]},
  { path: 'resenias/nueva/:idReserva', loadComponent: () => import('./features/resenias/resenia-form/resenia-form').then(m => m.ReseniaForm), canActivate: [authGuard],},
  { path: 'resenias/trabajador/:idTrabajador', loadComponent: () => import('./features/resenias/resenias-list/resenias-list').then(m => m.ReseniasList), canActivate: [authGuard],},
  { path: 'resenias/:idResenia', loadComponent: () => import('./features/resenias/resenia-detail/resenia-detail').then(m => m.ReseniaDetail), canActivate: [authGuard],},
  { path: 'clientes/reserva/:idReserva', loadComponent: () => import('./features/perfil/cliente-detail/cliente-detail').then(m => m.ClienteDetail), canActivate: [authGuard],},
  { path: 'notificaciones', loadComponent: ()=> import('./features/notificaciones/notificaciones').then(m=>m.Notificaciones)},
  { path: 'mis-favoritos', loadComponent: () => import('./features/favoritos/favoritos-list/favoritos-list').then(m => m.FavoritosList), canActivate: [authGuard],},
  {path: 'admin/pendientes',loadComponent: () => import('./features/admin/servicios-pendientes/servicio-pendiente-card/servicio-pendiente-list').then(m=>m.ServicioPendienteList),canActivate: [authGuard]},
  { path: '**',redirectTo: '',pathMatch: 'full'},
];

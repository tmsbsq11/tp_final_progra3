import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ListaServicios } from './features/servicios/lista-servicios/lista-servicios';
import { ReservaForm } from './features/reservas/reserva-form';
import { authGuard } from './core/guards/auth.guard';
import { TrabajadorList } from './features/servicios/trabajadores/trabajador-list/trabajador-list';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'admin/categorias', loadComponent: () => import('./features/categorias/categoria-form/categoria-form').then(m => m.CategoriaForm) },
  { path: 'admin/categorias/lista', loadComponent: () => import('./features/categorias/categorias-lista/categorias-lista').then(m => m.CategoriasLista) },
  { path: 'servicios/:id/reservar', loadComponent: () => import('./features/reservas/reserva-form').then(m => m.ReservaForm) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register)},
  {path: 'perfil/cliente', loadComponent: ()=> import('./features/perfil/perfil-clientes/perfilClientes').then(m=>m.PerfilClientes)},
  {path:'perfil/trabajador',loadComponent: ()=> import('./features/perfil/perfil-trabajadores/perfil-trabajadores').then(m=>m.PerfilTrabajadores)},
  { path: 'servicios', component: ListaServicios, canActivate: [authGuard]},
  { path: 'trabajadores', component: TrabajadorList, canActivate: [authGuard]},
  {path: 'trabajadores/:id',loadComponent: () => import('./features/servicios/trabajadores/trabajador-detail/trabajador-detail').then(m => m.TrabajadorDetail),canActivate: [authGuard]},
  { path: 'mis-reservas', loadComponent: () => import('./features/reservas/mis-reservas/mis-reservas').then(m => m.MisReservas) },
  {path: 'mis-postulaciones', loadComponent: () => import('./features/servicios/postulaciones/mis-postulaciones/mis-postulaciones').then(m => m.MisPostulaciones), canActivate: [authGuard]},
  {path: 'mis-postulaciones/nueva', loadComponent: () => import('./features/servicios/postulaciones/postulacion-form/postulacion-form').then(m => m.PostulacionForm), canActivate: [authGuard]},
  {path: 'mis-postulaciones/:id/editar', loadComponent: () =>import('./features/servicios/postulaciones/postulacion-form/postulacion-form').then(m => m.PostulacionForm), canActivate: [authGuard]},
  { path: '**',redirectTo: '',pathMatch: 'full'},
];
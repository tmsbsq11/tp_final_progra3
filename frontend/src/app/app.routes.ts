import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ListaServicios } from './features/servicios/lista-servicios/lista-servicios';
import { ReservaForm } from './features/reservas/reserva-form';
import { authGuard } from './core/guards/auth.guard';

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
  { path: '**',redirectTo: '',pathMatch: 'full'},
];
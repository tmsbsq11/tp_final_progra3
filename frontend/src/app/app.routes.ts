import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { ListaServicios } from './features/servicios/lista-servicios/lista-servicios';
import { authGuard } from './core/guards/auth.guard';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
  {path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register)},
  {path: 'perfil/cliente', loadComponent: ()=> import('./features/perfil/perfil-clientes/perfilClientes').then(m=>m.PerfilClientes)},
  {path:'perfil/trabajador',loadComponent: ()=> import('./features/perfil/perfil-trabajadores/perfil-trabajadores').then(m=>m.PerfilTrabajadores)},
  {path: 'servicios', component: ListaServicios, canActivate: [authGuard]},
  {path: '**',redirectTo: '',pathMatch: 'full'},
];
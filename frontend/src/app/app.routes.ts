import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Login } from './features/auth/login/login';
import { ListaServicios } from './features/servicios/lista-servicios/lista-servicios';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  {path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register)},
  {path: 'servicios', component: ListaServicios},
  {path: '**',redirectTo: '',pathMatch: 'full'},
];
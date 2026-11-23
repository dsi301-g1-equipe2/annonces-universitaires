import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth-guard';
import { Espace } from './pages/espace/espace';
import { Login } from './pages/login/login';

export const routes: Routes = [
    { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'espace', component: Espace, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'espace' },
  { path: '**', redirectTo: 'espace' },
];

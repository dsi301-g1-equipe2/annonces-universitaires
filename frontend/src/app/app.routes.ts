import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth-guard';
import { Espace } from './pages/espace/espace';
import { Login } from './pages/login/login';
import { Inscription } from './pages/inscription/inscription';
export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'inscription', component: Inscription },
  { path: 'espace', component: Espace, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'espace' },
  { path: '**', redirectTo: 'espace' },
];

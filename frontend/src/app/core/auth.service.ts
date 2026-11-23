import {  inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { Etudiant } from '../models/etudiant';
const TOKEN_KEY = 'token';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly apiUrl = 'https://grp1-annonces-api-drc9cdemhpftduaw.austriaeast-01.azurewebsites.net';
  readonly etudiant = signal<Etudiant | null>(null);

  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  estConnecte(): boolean {
    return !!this.getToken();
  }

  login(email: string, motDePasse: string) {
    return this.http
      .post<{ token: string; etudiant: Etudiant }>(`${this.apiUrl}/auth/login`, { email, motDePasse })
      .pipe(
        tap((r) => {
          localStorage.setItem(TOKEN_KEY, r.token);
          this.etudiant.set(r.etudiant);
        }),
      );
  }

  me() {
    return this.http
      .get<{ etudiant: Etudiant }>(`${this.apiUrl}/me`)
      .pipe(tap((r) => this.etudiant.set(r.etudiant)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this.etudiant.set(null);
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_URL = 'https://grp1-annonces-api-drc9cdemhpftduaw.austriaeast-01.azurewebsites.net';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private http = inject(HttpClient);
  info = signal<{ nom: string } | null>(null);
  erreur = signal(false);

  constructor() {
    this.http.get<{ nom: string }>(`${API_URL}/api/info`).subscribe({
      next: (r) => this.info.set(r),
      error: () => this.erreur.set(true)
    });
  }
}
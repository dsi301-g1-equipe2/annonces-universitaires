import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  imports: [],
  selector: 'app-espace',
  styleUrl: './espace.css',
  templateUrl: './espace.html',
})
export class Espace implements OnInit {
   readonly auth = inject(AuthService);
  readonly erreur = signal<string | null>(null);

  ngOnInit() {
    this.auth.me().subscribe({
      error: () => this.erreur.set('Impossible de charger votre profil.'),
    });
  }
}
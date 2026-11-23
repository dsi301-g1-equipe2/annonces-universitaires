import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
 private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly chargement = signal(false);
  readonly erreur = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    motDePasse: ['', Validators.required],
  });

  envoyer() {
    if (this.form.invalid) return;
    this.chargement.set(true);
    this.erreur.set(null);

    const { email, motDePasse } = this.form.getRawValue();
    this.auth.login(email, motDePasse).subscribe({
      next: () => this.router.navigate(['/espace'], { replaceUrl: true }),
      error: (err: HttpErrorResponse) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.erreur ?? 'Connexion impossible. Réessayez.');
      },
    });
  }
}

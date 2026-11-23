import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

const API_URL =
  location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://grp1-annonces-api-drc9cdemhpftduaw.austriaeast-01.azurewebsites.net';

const TYPES_CARTE = ['image/jpeg', 'image/png'];
const TAILLE_MAX_MO = 2;

@Component({
  selector: 'app-inscription',
  imports: [ReactiveFormsModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    emailInstitutionnel: ['', [Validators.required, Validators.pattern(/^[^\s@]+@isetch\.tn$/)]],
    motDePasse: ['', [Validators.required, Validators.minLength(8)]],
  });

  carte: File | null = null;
  erreurCarte = signal('');
  erreur = signal('');
  succes = signal(false);
  envoi = signal(false);

  choisirCarte(event: Event) {
    const fichier = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.carte = null;
    this.erreurCarte.set('');
    if (!fichier) return;

    if (!TYPES_CARTE.includes(fichier.type)) {
      this.erreurCarte.set('Format accepté : JPG ou PNG');
    } else if (fichier.size > TAILLE_MAX_MO * 1024 * 1024) {
      this.erreurCarte.set(`Fichier trop volumineux (maximum ${TAILLE_MAX_MO} Mo)`);
    } else {
      this.carte = fichier;
    }
  }

  envoyer() {
    this.erreur.set('');
    if (!this.carte) this.erreurCarte.set('La carte étudiante est obligatoire');
    if (this.form.invalid || !this.carte) {
      this.form.markAllAsTouched(); // affiche les erreurs de tous les champs
      return;
    }

    // Un fichier ne peut pas partir en JSON : on envoie un FormData (multipart/form-data)
    const donnees = new FormData();
    for (const [cle, valeur] of Object.entries(this.form.getRawValue())) {
      donnees.append(cle, valeur);
    }
    donnees.append('carteEtudiant', this.carte);

    this.envoi.set(true);
    this.http.post(`${API_URL}/api/auth/register`, donnees).subscribe({
      next: () => {
        this.succes.set(true);
        this.envoi.set(false);
      },
      error: (err) => {
        this.erreur.set(err.error?.erreur ?? 'Impossible de joindre le serveur');
        this.envoi.set(false);
      },
    });
  }
}
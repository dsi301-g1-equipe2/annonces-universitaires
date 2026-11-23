export interface Etudiant {
    id: string;
  nom: string;
  prenom: string;
  emailInstitutionnel: string;
  statut: string;
  motifRefus?: string;
  dateInscription?: string;
}

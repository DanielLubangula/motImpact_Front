export interface Auteur {
  id: string;
  nom_auteur: string;
  photo_auteur: string;
  courte_biographie: string;
  biographie_complete: string;
  univers_litteraire: string;
  message_accroche: string;
  email_contact: string;
  reseaux_sociaux: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Livre {
  id: string;
  titre: string;
  couverture: string;
  description: string; // Correspond au backend
  extrait: string;
  statut: 'gratuit' | 'payant';
  prix: number;
  fichier_pdf: string;
  is_featured: boolean; // Correspond au backend
  created_at: string;
  updated_at?: string;
}

export interface Actualite {
  _id: string;
  id?: string; // Fallback
  titre: string;
  contenu: string;
  image?: string;
  date_publication: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  statut: 'non_lu' | 'lu' | 'repondu';
  date_envoi: string;
  created_at?: string;
}

export interface Achat {
  id: string;
  livre_id: string;
  email_client: string;
  statut_paiement: string;
  montant: number;
  date_achat: string;
  transaction_id: string;
  created_at: string;
}

export interface HomeData {
  nom_auteur: string;
  photo_auteur: string;
  courte_biographie: string;
  message_accroche: string;
  livre_mis_en_avant: Livre | null;
}

export interface BiographieData {
  nom_auteur: string;
  biographie_complete: string;
  photo: string;
  univers_litteraire: string;
}

export interface Dashboard {
  nombre_livres: number;
  nombre_ventes: number;
  nombre_messages: number;
  statistiques_simples: any;
  nombre_connecte: number;
}

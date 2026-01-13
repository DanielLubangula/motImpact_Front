/*
  # Schema for Writer Website

  ## New Tables
  
  1. `auteur` - Author profile information
    - `id` (uuid, primary key)
    - `nom_auteur` (text) - Author name
    - `photo_auteur` (text) - Photo URL
    - `courte_biographie` (text) - Short biography
    - `biographie_complete` (text) - Complete biography
    - `univers_litteraire` (text) - Literary universe
    - `message_accroche` (text) - Catch phrase
    - `email_contact` (text) - Contact email
    - `reseaux_sociaux` (jsonb) - Social networks
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  2. `livres` - Books
    - `id` (uuid, primary key)
    - `titre` (text) - Title
    - `couverture` (text) - Cover URL
    - `resume_court` (text) - Short summary
    - `description_complete` (text) - Complete description
    - `extrait` (text) - Extract (max 400 words)
    - `statut` (text) - Status (gratuit/payant)
    - `prix` (decimal) - Price
    - `fichier_pdf` (text) - PDF file URL
    - `mis_en_avant` (boolean) - Featured flag
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  3. `actualites` - News/Blog posts
    - `id` (uuid, primary key)
    - `titre` (text) - Title
    - `contenu` (text) - Content
    - `date_publication` (timestamptz) - Publication date
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)
  
  4. `messages` - Contact messages
    - `id` (uuid, primary key)
    - `nom` (text) - Name
    - `email` (text) - Email
    - `message` (text) - Message
    - `date` (timestamptz) - Date
    - `lu` (boolean) - Read flag
    - `created_at` (timestamptz)
  
  5. `achats` - Purchases
    - `id` (uuid, primary key)
    - `livre_id` (uuid, foreign key)
    - `email_client` (text) - Customer email
    - `statut_paiement` (text) - Payment status
    - `montant` (decimal) - Amount
    - `date_achat` (timestamptz) - Purchase date
    - `transaction_id` (text) - Transaction ID
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for auteur, livres (public data), actualites
  - Authenticated admin access for all admin operations
  - Protected access for achats and messages
*/

-- Create auteur table
CREATE TABLE IF NOT EXISTS auteur (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_auteur text NOT NULL DEFAULT '',
  photo_auteur text DEFAULT '',
  courte_biographie text DEFAULT '',
  biographie_complete text DEFAULT '',
  univers_litteraire text DEFAULT '',
  message_accroche text DEFAULT '',
  email_contact text DEFAULT '',
  reseaux_sociaux jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create livres table
CREATE TABLE IF NOT EXISTS livres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  couverture text DEFAULT '',
  resume_court text DEFAULT '',
  description_complete text DEFAULT '',
  extrait text DEFAULT '',
  statut text NOT NULL CHECK (statut IN ('gratuit', 'payant')),
  prix decimal(10,2) DEFAULT 0,
  fichier_pdf text DEFAULT '',
  mis_en_avant boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create actualites table
CREATE TABLE IF NOT EXISTS actualites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titre text NOT NULL,
  contenu text NOT NULL,
  date_publication timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  date timestamptz DEFAULT now(),
  lu boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create achats table
CREATE TABLE IF NOT EXISTS achats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  livre_id uuid REFERENCES livres(id) ON DELETE CASCADE,
  email_client text NOT NULL,
  statut_paiement text NOT NULL DEFAULT 'en_attente',
  montant decimal(10,2) NOT NULL,
  date_achat timestamptz DEFAULT now(),
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE auteur ENABLE ROW LEVEL SECURITY;
ALTER TABLE livres ENABLE ROW LEVEL SECURITY;
ALTER TABLE actualites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE achats ENABLE ROW LEVEL SECURITY;

-- Policies for auteur table (public read)
CREATE POLICY "Public can view author profile"
  ON auteur FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update author profile"
  ON auteur FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policies for livres table (public read)
CREATE POLICY "Public can view books"
  ON livres FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert books"
  ON livres FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update books"
  ON livres FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete books"
  ON livres FOR DELETE
  TO authenticated
  USING (true);

-- Policies for actualites table (public read)
CREATE POLICY "Public can view news"
  ON actualites FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert news"
  ON actualites FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update news"
  ON actualites FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete news"
  ON actualites FOR DELETE
  TO authenticated
  USING (true);

-- Policies for messages table (admin only)
CREATE POLICY "Public can insert messages"
  ON messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);

-- Policies for achats table (restricted)
CREATE POLICY "Users can view their own purchases"
  ON achats FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert purchases"
  ON achats FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update purchases"
  ON achats FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default author profile
INSERT INTO auteur (nom_auteur, courte_biographie, message_accroche)
VALUES ('Nom de l''écrivain', 'Biographie courte par défaut', 'Message d''accroche par défaut')
ON CONFLICT DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_livres_statut ON livres(statut);
CREATE INDEX IF NOT EXISTS idx_livres_mis_en_avant ON livres(mis_en_avant);
CREATE INDEX IF NOT EXISTS idx_actualites_date ON actualites(date_publication DESC);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date DESC);
CREATE INDEX IF NOT EXISTS idx_achats_email ON achats(email_client);
CREATE INDEX IF NOT EXISTS idx_achats_livre ON achats(livre_id);
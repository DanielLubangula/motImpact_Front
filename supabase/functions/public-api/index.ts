import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const path = url.pathname.replace('/public-api/', '');

    // GET /api/public/home
    if (path === 'home' && req.method === 'GET') {
      const { data: auteur } = await supabase
        .from('auteur')
        .select('nom_auteur, photo_auteur, courte_biographie, message_accroche')
        .single();

      const { data: livre } = await supabase
        .from('livres')
        .select('id, titre, resume_court, couverture, statut, prix')
        .eq('mis_en_avant', true)
        .maybeSingle();

      return new Response(
        JSON.stringify({
          nom_auteur: auteur?.nom_auteur || '',
          photo_auteur: auteur?.photo_auteur || '',
          courte_biographie: auteur?.courte_biographie || '',
          message_accroche: auteur?.message_accroche || '',
          livre_mis_en_avant: livre || null,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /api/public/biographie
    if (path === 'biographie' && req.method === 'GET') {
      const { data: auteur } = await supabase
        .from('auteur')
        .select('nom_auteur, biographie_complete, photo_auteur, univers_litteraire')
        .single();

      return new Response(
        JSON.stringify({
          nom_auteur: auteur?.nom_auteur || '',
          biographie_complete: auteur?.biographie_complete || '',
          photo: auteur?.photo_auteur || '',
          univers_litteraire: auteur?.univers_litteraire || '',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /api/public/livres
    if (path === 'livres' && req.method === 'GET') {
      const { data: livres } = await supabase
        .from('livres')
        .select('id, titre, couverture, resume_court, statut, prix')
        .order('created_at', { ascending: false });

      return new Response(
        JSON.stringify(
          livres?.map((livre) => ({
            id_livre: livre.id,
            titre: livre.titre,
            couverture: livre.couverture,
            résumé_court: livre.resume_court,
            statut: livre.statut,
            prix: livre.prix,
          })) || []
        ),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /api/public/livres/{id}
    if (path.startsWith('livres/') && req.method === 'GET') {
      const id = path.split('/')[1];
      const { data: livre } = await supabase
        .from('livres')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!livre) {
        return new Response(JSON.stringify({ error: 'Livre non trouvé' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({
          id_livre: livre.id,
          titre: livre.titre,
          couverture: livre.couverture,
          description_complete: livre.description_complete,
          extrait: livre.extrait,
          statut: livre.statut,
          prix: livre.prix,
          bouton_action: livre.statut === 'gratuit' ? 'Lire' : 'Acheter',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST /api/public/paiement
    if (path === 'paiement' && req.method === 'POST') {
      const { id_livre, email_client } = await req.json();

      const { data: livre } = await supabase
        .from('livres')
        .select('prix, titre')
        .eq('id', id_livre)
        .maybeSingle();

      if (!livre) {
        return new Response(JSON.stringify({ error: 'Livre non trouvé' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data: achat } = await supabase
        .from('achats')
        .insert({
          livre_id: id_livre,
          email_client,
          statut_paiement: 'en_attente',
          montant: livre.prix,
        })
        .select()
        .single();

      return new Response(
        JSON.stringify({
          statut_paiement: 'en_attente',
          lien_paiement: `https://paypal.com/payment/${achat?.id}`,
          message_confirmation: 'Paiement en cours de traitement',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /api/public/telechargement/{id_livre}
    if (path.startsWith('telechargement/') && req.method === 'GET') {
      const id_livre = path.split('/')[1];
      const email = url.searchParams.get('email');

      const { data: livre } = await supabase
        .from('livres')
        .select('statut, fichier_pdf')
        .eq('id', id_livre)
        .maybeSingle();

      if (!livre) {
        return new Response(JSON.stringify({ error: 'Livre non trouvé' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (livre.statut === 'gratuit') {
        return new Response(
          JSON.stringify({
            lien_telechargement: livre.fichier_pdf,
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (livre.statut === 'payant' && email) {
        const { data: achat } = await supabase
          .from('achats')
          .select('statut_paiement')
          .eq('livre_id', id_livre)
          .eq('email_client', email)
          .eq('statut_paiement', 'validé')
          .maybeSingle();

        if (achat) {
          return new Response(
            JSON.stringify({
              lien_telechargement: livre.fichier_pdf,
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }

      return new Response(
        JSON.stringify({ error: 'Accès non autorisé. Paiement requis.' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /api/public/actus
    if (path === 'actus' && req.method === 'GET') {
      const { data: actualites } = await supabase
        .from('actualites')
        .select('id, titre, contenu, date_publication')
        .order('date_publication', { ascending: false });

      return new Response(
        JSON.stringify(
          actualites?.map((article) => ({
            id_article: article.id,
            titre: article.titre,
            contenu: article.contenu,
            date_publication: article.date_publication,
          })) || []
        ),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST /api/public/contact
    if (path === 'contact' && req.method === 'POST') {
      const { nom, email, message } = await req.json();

      await supabase.from('messages').insert({
        nom,
        email,
        message,
      });

      return new Response(
        JSON.stringify({
          confirmation_envoi: 'Message envoyé avec succès',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ error: 'Route non trouvée' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
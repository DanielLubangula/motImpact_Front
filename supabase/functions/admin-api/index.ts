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
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader && !req.url.includes('/login')) {
      return new Response(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL(req.url);
    const path = url.pathname.replace('/admin-api/', '');

    // POST /api/admin/login
    if (path === 'login' && req.method === 'POST') {
      const { email, mot_de_passe } = await req.json();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: mot_de_passe,
      });

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Identifiants incorrects' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          token_authentification: data.session?.access_token,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /api/admin/dashboard
    if (path === 'dashboard' && req.method === 'GET') {
      const { count: nombre_livres } = await supabase
        .from('livres')
        .select('*', { count: 'exact', head: true });

      const { count: nombre_ventes } = await supabase
        .from('achats')
        .select('*', { count: 'exact', head: true })
        .eq('statut_paiement', 'validé');

      const { count: nombre_messages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('lu', false);

      return new Response(
        JSON.stringify({
          nombre_livres: nombre_livres || 0,
          nombre_ventes: nombre_ventes || 0,
          nombre_messages: nombre_messages || 0,
          statistiques_simples: {
            revenus_totaux: 0,
            livres_gratuits: 0,
            livres_payants: 0,
          },
          nombre_connecte: 1,
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST /api/admin/livres
    if (path === 'livres' && req.method === 'POST') {
      const body = await req.json();
      const { data: livre, error } = await supabase
        .from('livres')
        .insert({
          titre: body.titre,
          description_complete: body.description,
          extrait: body.extrait,
          statut: body.statut,
          prix: body.prix || 0,
          fichier_pdf: body.fichier_pdf,
          couverture: body.couverture,
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(livre), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/admin/livres/{id}
    if (path.startsWith('livres/') && req.method === 'PUT') {
      const id = path.split('/')[1];
      const body = await req.json();

      const { data: livre, error } = await supabase
        .from('livres')
        .update({
          titre: body.titre,
          description_complete: body.description,
          extrait: body.extrait,
          statut: body.statut,
          prix: body.prix || 0,
          fichier_pdf: body.fichier_pdf,
          couverture: body.couverture,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(livre), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /api/admin/livres/{id}
    if (path.startsWith('livres/') && req.method === 'DELETE') {
      const id = path.split('/')[1];
      const { error } = await supabase.from('livres').delete().eq('id', id);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Livre supprimé' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // POST /api/admin/actus
    if (path === 'actus' && req.method === 'POST') {
      const { titre, contenu } = await req.json();

      const { data: article, error } = await supabase
        .from('actualites')
        .insert({ titre, contenu })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(article), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/admin/actus/{id}
    if (path.startsWith('actus/') && req.method === 'PUT') {
      const id = path.split('/')[1];
      const { titre, contenu } = await req.json();

      const { data: article, error } = await supabase
        .from('actualites')
        .update({ titre, contenu, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(article), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE /api/admin/actus/{id}
    if (path.startsWith('actus/') && req.method === 'DELETE') {
      const id = path.split('/')[1];
      const { error } = await supabase.from('actualites').delete().eq('id', id);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Article supprimé' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // GET /api/admin/messages
    if (path === 'messages' && req.method === 'GET') {
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .order('date', { ascending: false });

      return new Response(JSON.stringify(messages || []), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/admin/profil
    if (path === 'profil' && req.method === 'PUT') {
      const { biographie, photo, email_contact, réseaux_sociaux } =
        await req.json();

      const { data: auteur, error } = await supabase
        .from('auteur')
        .update({
          biographie_complete: biographie,
          photo_auteur: photo,
          email_contact,
          reseaux_sociaux: réseaux_sociaux,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify(auteur), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Eye, Feather } from 'lucide-react';
import { publicAPI } from '../lib/api';
import { Actualite } from '../types';

export function DetailActualite() {
  const { id } = useParams<{ id: string }>();
  const [actualite, setActualite] = useState<Actualite | null>(null);

  useEffect(() => {
    const loadActualite = async () => {
      if (!id) return;
      try {
        const response = await publicAPI(`actus/${id}`);
        setActualite(response.data?.actu || response.actu);
      } catch (err) {
        console.error('Erreur chargement actualité:', err);
      }
    };
    loadActualite();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!actualite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Feather className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-amber-800 mb-4">Actualité introuvable</h1>
          <Link
            to="/actualites"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 text-white rounded-xl hover:bg-amber-800 transition-colors font-serif"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux actualités
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        {/* Navigation */}
        <Link
          to="/actualites"
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-serif mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux actualités
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 overflow-hidden">
          {/* Image */}
          {actualite.image && (
            <div className="w-full h-64 sm:h-80 md:h-96 overflow-hidden">
              <img 
                src={actualite.image} 
                alt={actualite.titre}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8 md:p-12">
            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-amber-600 font-serif mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(actualite.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Lecture 5 min</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{Math.floor(Math.random() * 1000) + 200} vues</span>
              </div>
            </div>

            {/* Titre */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-8 leading-tight">
              {actualite.titre}
            </h1>

            {/* Contenu */}
            <div className="prose prose-lg prose-amber max-w-none">
              <div className="text-amber-800 font-serif leading-relaxed text-justify">
                {actualite.contenu.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6 last:mb-0 text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
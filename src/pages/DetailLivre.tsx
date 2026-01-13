import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, Euro, Gift, Calendar, Star, Quote } from 'lucide-react';
import { publicAPI } from '../lib/api';
import { Livre } from '../types';

export function DetailLivre() {
  const { id } = useParams<{ id: string }>();
  const [livre, setLivre] = useState<Livre | null>(null);

  useEffect(() => {
    const loadLivre = async () => {
      if (!id) return;
      
      try {
        const response = await publicAPI(`books/${id}`);
        setLivre(response.data);
      } catch (err) {
        console.error('Erreur chargement livre:', err);
        setLivre(null);
      }
    };
    loadLivre();
  }, [id]);

  if (!livre) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-center">
          <BookOpen className="w-20 h-20 text-amber-400 mx-auto mb-6" />
          <h2 className="text-2xl font-serif font-bold text-amber-800 mb-4">Œuvre introuvable</h2>
          <p className="text-amber-600 font-serif mb-6">Cette œuvre n'existe pas ou n'est plus disponible.</p>
          <Link
            to="/livres"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la bibliothèque
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Navigation de retour */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-200 py-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <Link
            to="/livres"
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors font-serif font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour à la bibliothèque
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Image de couverture */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="relative">
                {livre.is_featured && (
                  <div className="absolute -top-3 -right-3 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 rounded-full text-sm font-serif font-bold flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Coup de cœur
                  </div>
                )}
                
                {/* Cadre décoratif */}
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl opacity-30 blur-xl"></div>
                <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-2xl p-3 border-4 border-amber-200">
                  <img
                    src={livre.couverture}
                    alt={livre.titre}
                    className="w-full rounded-xl shadow-lg aspect-[3/4] object-cover sepia-[0.1]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';
                    }}
                  />
                  
                  {/* Ornements décoratifs */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-amber-600 rounded-full opacity-70"></div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-600 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-600 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-700 rounded-full opacity-70"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-6 md:space-y-8">
            {/* En-tête */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4 md:mb-6 leading-tight">
                {livre.titre}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* Statut et prix */}
                {livre.statut === 'gratuit' ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full font-serif font-bold border border-green-200">
                    <Gift className="w-5 h-5" />
                    Lecture libre
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full font-serif font-bold border border-amber-200">
                    <Euro className="w-5 h-5" />
                    {livre.prix}€
                  </div>
                )}

                {/* Date de publication */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full font-serif text-sm border border-gray-300">
                  <Calendar className="w-4 h-4" />
                  {new Date(livre.created_at).toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>

              {/* Résumé court */}
              <p className="text-lg md:text-xl text-amber-700 font-serif italic leading-relaxed mb-6 md:mb-8">
                {livre.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                {livre.statut === 'gratuit' ? (
                  <>
                    <button className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-base md:text-lg shadow-lg">
                      <BookOpen className="w-5 h-5" />
                      Lire en ligne
                    </button>
                    <button 
                      onClick={() => window.open(`http://localhost:5000/api/public/livres/${livre._id || livre.id}/telecharger`, '_blank')}
                      className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 border-2 border-amber-700 text-amber-800 rounded-xl hover:bg-amber-100 transition-all duration-300 font-serif font-semibold text-base md:text-lg"
                    >
                      <Download className="w-5 h-5" />
                      Télécharger PDF
                    </button>
                  </>
                ) : (
                  <>
                    <button className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-base md:text-lg shadow-lg">
                      <Euro className="w-5 h-5" />
                      Acquérir l'ouvrage
                    </button>
                    <button className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 border-2 border-amber-700 text-amber-800 rounded-xl hover:bg-amber-100 transition-all duration-300 font-serif font-semibold text-base md:text-lg">
                      <BookOpen className="w-5 h-5" />
                      Aperçu gratuit
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Description complète */}
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 md:p-8 shadow-lg border-2 border-amber-200">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-900 mb-4 md:mb-6">
                À propos de cette œuvre
              </h2>
              <div className="prose prose-amber max-w-none">
                {livre.description && livre.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-base md:text-lg text-amber-800 font-serif leading-relaxed mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Extrait */}
            {livre.extrait && (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 md:p-8 shadow-lg border-2 border-orange-200 relative">
                <Quote className="absolute top-4 left-4 w-8 h-8 md:w-12 md:h-12 text-orange-300 opacity-50" />
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-900 mb-4 md:mb-6 pl-8 md:pl-12">
                  Extrait
                </h2>
                <div className="pl-8 md:pl-12">
                  {livre.extrait && livre.extrait.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-base md:text-lg text-amber-800 font-serif italic leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="text-right mt-6">
                  <span className="text-amber-700 font-serif italic">— Enock</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
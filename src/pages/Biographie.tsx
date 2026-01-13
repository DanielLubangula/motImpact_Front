import { useEffect, useState } from 'react';
import { Feather, Quote, Calendar, MapPin, Award, BookOpen, Heart, Lightbulb } from 'lucide-react';
import { publicAPI } from '../lib/api';
import { BiographieData } from '../types';

export function Biographie() {
  const [data, setData] = useState<BiographieData | null>(null);

  useEffect(() => {
    const loadBiographie = async () => {
      try {
        const response = await publicAPI('bio');
        setData(response.data || response);
      } catch (err) {
        console.error('Erreur chargement biographie:', err);
      }
    };
    loadBiographie();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 py-6 sm:py-8 md:py-10 border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
              <Feather className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-amber-700 font-serif mb-1">Portrait de l'auteur</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-900 leading-tight">
                {data?.nom_auteur || 'Enock'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Photo et informations */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              {/* Photo principale */}
              <div className="relative mb-6 sm:mb-8 md:mb-10">
                {/* Cadre décoratif */}
                <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl opacity-30 blur-xl"></div>
                <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl sm:rounded-3xl shadow-2xl p-3 sm:p-4 md:p-6 border-4 border-amber-200">
                  <img
                    src={data?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face'}
                    alt={data?.nom_auteur || 'Enock'}
                    className="w-full rounded-xl sm:rounded-2xl shadow-lg aspect-[3/4] object-cover sepia-[0.2]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face';
                    }}
                  />
                  
                  {/* Ornements décoratifs */}
                  <div className="absolute -top-2 -left-2 w-4 h-4 sm:w-6 sm:h-6 bg-amber-600 rounded-full opacity-70"></div>
                  <div className="absolute -top-2 -right-2 w-3 h-3 sm:w-4 sm:h-4 bg-orange-600 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-600 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-2 -right-2 w-4 h-4 sm:w-6 sm:h-6 bg-amber-700 rounded-full opacity-70"></div>
                </div>
              </div>

              {/* Informations rapides */}
              <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-2 border-amber-200">
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-amber-900 mb-4 sm:mb-6">
                  En quelques mots
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-amber-600 font-serif">Début de carrière</p>
                      <p className="text-sm sm:text-base font-serif font-semibold text-amber-900">2018</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-amber-600 font-serif">Origine</p>
                      <p className="text-sm sm:text-base font-serif font-semibold text-amber-900">République Démocratique du Congo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-amber-600 font-serif">Œuvres publiées</p>
                      <p className="text-sm sm:text-base font-serif font-semibold text-amber-900">3 livres</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-amber-600 font-serif">Genre de prédilection</p>
                      <p className="text-sm sm:text-base font-serif font-semibold text-amber-900">Prose poétique</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-6 sm:space-y-8 md:space-y-10">
            {/* Biographie complète */}
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border-2 border-amber-200">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-900">
                  Mon Parcours
                </h2>
              </div>
              
              <div className="prose prose-amber max-w-none">
                {data?.biographie_complete && data.biographie_complete.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-sm sm:text-base md:text-lg text-amber-800 font-serif leading-relaxed mb-4 sm:mb-6 last:mb-0 text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Univers littéraire */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 text-orange-800" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-900">
                  Mon Univers Littéraire
                </h2>
              </div>
              
              <div className="prose prose-amber max-w-none">
                {data?.univers_litteraire && data.univers_litteraire.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-sm sm:text-base md:text-lg text-amber-800 font-serif leading-relaxed mb-4 sm:mb-6 last:mb-0 text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Citations inspirantes */}
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border-2 border-amber-300 relative overflow-hidden">
              {/* Motif décoratif */}
              <div className="absolute top-4 right-4 text-4xl sm:text-5xl md:text-6xl text-amber-300 opacity-30">❦</div>
              
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-6 sm:mb-8">
                Quelques Réflexions
              </h2>
              
              <div className="space-y-4 sm:space-y-6">
                <blockquote className="relative">
                  <Quote className="absolute -left-2 -top-2 w-6 h-6 sm:w-8 sm:h-8 text-amber-600 opacity-50" />
                  <p className="text-base sm:text-lg md:text-xl text-amber-800 font-serif italic leading-relaxed pl-6 sm:pl-8">
                    "Écrire, c'est offrir un refuge à ceux qui cherchent un sens dans le chaos du monde."
                  </p>
                </blockquote>
                
                <blockquote className="relative">
                  <Quote className="absolute -left-2 -top-2 w-6 h-6 sm:w-8 sm:h-8 text-amber-600 opacity-50" />
                  <p className="text-base sm:text-lg md:text-xl text-amber-800 font-serif italic leading-relaxed pl-6 sm:pl-8">
                    "Chaque livre que j'écris est une lettre d'amour adressée à l'humanité."
                  </p>
                </blockquote>
                
                <blockquote className="relative">
                  <Quote className="absolute -left-2 -top-2 w-6 h-6 sm:w-8 sm:h-8 text-amber-600 opacity-50" />
                  <p className="text-base sm:text-lg md:text-xl text-amber-800 font-serif italic leading-relaxed pl-6 sm:pl-8">
                    "Les mots ont le pouvoir de guérir les blessures que la vie nous inflige."
                  </p>
                </blockquote>
              </div>
              
              <div className="text-right mt-6 sm:mt-8">
                <span className="text-amber-700 font-serif italic text-sm sm:text-base">— Enock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
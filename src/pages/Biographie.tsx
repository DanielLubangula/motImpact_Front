import { useEffect, useState } from 'react';
import { Feather, Quote, Calendar, MapPin, Award, BookOpen, Heart, Lightbulb } from 'lucide-react';
import { publicAPI } from '../lib/api';
import { BiographieData } from '../types';

export function Biographie() {
  const [data, setData] = useState<BiographieData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBiographie = async () => {
      try {
        const response = await publicAPI('bio');
        console.log('Biographie data:', response);
        // Le backend renvoie data.admin
        const bioData = response.data?.admin || response.data || response;
        setData(bioData);
      } catch (err) {
        console.error('Erreur chargement biographie:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBiographie();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-amber-700 font-serif">Chargement de la biographie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 py-4 sm:py-6 md:py-8 lg:py-10 border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
              <Feather className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-800" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-amber-700 font-serif mb-0.5 sm:mb-1">Portrait de l'auteur</p>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-amber-900 leading-tight">
                {data?.nom || data?.nom_auteur || 'Enock'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12 py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 md:gap-10 lg:gap-16">
          {/* Photo et informations */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8">
              {/* Photo principale */}
              <div className="relative mb-4 sm:mb-6 md:mb-8 lg:mb-10 max-w-[240px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto lg:max-w-none">
                {/* Cadre décoratif */}
                <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 lg:-inset-6 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl sm:rounded-3xl opacity-30 blur-lg sm:blur-xl"></div>
                <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl sm:shadow-2xl p-1.5 sm:p-2 md:p-3 lg:p-6 border-2 sm:border-3 md:border-4 border-amber-200">
                  {data?.photo ? (
                    <img
                      src={data.photo}
                      alt={data?.nom || data?.nom_auteur || 'Auteur'}
                      className="w-full rounded-xl sm:rounded-2xl shadow-lg aspect-[3/4] object-cover sepia-[0.2]"
                    />
                  ) : (
                    <div className="w-full rounded-xl sm:rounded-2xl shadow-lg aspect-[3/4] bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                      <Feather className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-amber-700 opacity-50" />
                    </div>
                  )}
                  
                  {/* Ornements décoratifs */}
                  <div className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-amber-600 rounded-full opacity-70"></div>
                  <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-orange-600 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 sm:-bottom-2 sm:-left-2 w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-yellow-600 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-amber-700 rounded-full opacity-70"></div>
                </div>
              </div>

              {/* Informations rapides */}
              <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-8 shadow-md sm:shadow-lg border border-amber-200 sm:border-2">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-2xl font-serif font-bold text-amber-900 mb-2 sm:mb-3 md:mb-4 lg:mb-6">
                  En quelques mots
                </h3>
                <div className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4">
                  {/* <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 font-serif">Début de carrière</p>
                      <p className="text-xs sm:text-sm font-serif font-semibold text-amber-900">2018</p>
                    </div>
                  </div> */}
                  
                  <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-orange-700" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 font-serif">Origine</p>
                      <p className="text-xs sm:text-sm font-serif font-semibold text-amber-900">RD Congo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 font-serif">Œuvres</p>
                      <p className="text-xs sm:text-sm font-serif font-semibold text-amber-900">3 livres</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-600 font-serif">Genre</p>
                      <p className="text-xs sm:text-sm font-serif font-semibold text-amber-900">Prose poétique</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
            {/* Biographie complète */}
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-md sm:shadow-lg border border-amber-200 sm:border-2">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-800" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-amber-900">
                  Mon Parcours
                </h2>
              </div>
              
              <div className="prose prose-amber max-w-none">
                {data?.mon_parcours && data.mon_parcours.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-xs sm:text-sm md:text-base lg:text-lg text-amber-800 font-serif leading-relaxed mb-3 sm:mb-4 md:mb-6 last:mb-0 text-justify">
                    {paragraph}
                  </p>
                ))}
                {!data?.mon_parcours && (
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-amber-800 font-serif leading-relaxed text-justify italic">
                    Parcours en cours de rédaction...
                  </p>
                )}
              </div>
            </div>

            {/* Univers littéraire */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-md sm:shadow-lg border border-orange-200 sm:border-2">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-800" />
                </div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-amber-900">
                  Mon Univers Littéraire
                </h2>
              </div>
              
              <div className="prose prose-amber max-w-none">
                {data?.mon_univers_litteraire && data.mon_univers_litteraire.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-xs sm:text-sm md:text-base lg:text-lg text-amber-800 font-serif leading-relaxed mb-3 sm:mb-4 md:mb-6 last:mb-0 text-justify">
                    {paragraph}
                  </p>
                ))}
                {!data?.mon_univers_litteraire && (
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-amber-800 font-serif leading-relaxed text-justify italic">
                    Univers littéraire en cours de rédaction...
                  </p>
                )}
              </div>
            </div>

            {/* Biographie complète */}
            {data?.biographie && (
              <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-md sm:shadow-lg border border-amber-200 sm:border-2">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
                    <Feather className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-800" />
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-amber-900">
                    Biographie Complète
                  </h2>
                </div>
                
                <div className="prose prose-amber max-w-none">
                  {data.biographie.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-xs sm:text-sm md:text-base lg:text-lg text-amber-800 font-serif leading-relaxed mb-3 sm:mb-4 md:mb-6 last:mb-0 text-justify">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Citations inspirantes */}
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-md sm:shadow-lg border border-amber-300 sm:border-2 relative overflow-hidden">
              {/* Motif décoratif */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-amber-300 opacity-30">❦</div>
              
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-serif font-bold text-amber-900 mb-4 sm:mb-6 md:mb-8">
                Quelques Réflexions
              </h2>
              
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                <blockquote className="relative">
                  <Quote className="absolute -left-1 -top-1 sm:-left-2 sm:-top-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-600 opacity-50" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-amber-800 font-serif italic leading-relaxed pl-5 sm:pl-6 md:pl-8">
                    "Écrire, c'est offrir un refuge à ceux qui cherchent un sens dans le chaos du monde."
                  </p>
                </blockquote>
                
                <blockquote className="relative">
                  <Quote className="absolute -left-1 -top-1 sm:-left-2 sm:-top-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-600 opacity-50" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-amber-800 font-serif italic leading-relaxed pl-5 sm:pl-6 md:pl-8">
                    "Chaque livre que j'écris est une lettre d'amour adressée à l'humanité."
                  </p>
                </blockquote>
                
                <blockquote className="relative">
                  <Quote className="absolute -left-1 -top-1 sm:-left-2 sm:-top-2 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-600 opacity-50" />
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-amber-800 font-serif italic leading-relaxed pl-5 sm:pl-6 md:pl-8">
                    "Les mots ont le pouvoir de guérir les blessures que la vie nous inflige."
                  </p>
                </blockquote>
              </div>
              
              <div className="text-right mt-4 sm:mt-6 md:mt-8">
                <span className="text-amber-700 font-serif italic text-xs sm:text-sm md:text-base">— Enock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
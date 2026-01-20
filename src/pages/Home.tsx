import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Feather, Quote, Star } from 'lucide-react';
import { publicAPI } from '../lib/api';
import { HomeData, Livre } from '../types';

export function Home() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await publicAPI('home');
        console.log(response);
        setData(response.data || response);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-amber-700 font-serif">Chargement de l'accueil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative py-4 md:py-8 overflow-hidden">
        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl text-amber-800">❦</div>
          <div className="absolute top-32 right-20 text-4xl text-amber-700">✦</div>
          <div className="absolute bottom-20 left-20 text-5xl text-amber-600">❧</div>
          <div className="absolute bottom-10 right-10 text-3xl text-amber-800">✧</div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
            <div className="lg:col-span-3 space-y-4 md:space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-xs sm:text-sm font-serif font-semibold mb-4 border border-amber-200">
                  <Feather className="w-3 h-3 sm:w-4 sm:h-4" />
                  Plume littéraire
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-amber-900 mb-3 md:mb-4 leading-tight">
                  {data?.nom_auteur || 'Henock'}
                </h1>
                <div className="relative">
                  <Quote className="absolute -left-2 -top-1 w-6 h-6 sm:w-8 sm:h-8 text-amber-600 opacity-50" />
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-amber-800 mb-3 md:mb-4 leading-relaxed font-serif italic pl-6 sm:pl-8">
                    {data?.message_accroche || 'Bienvenue dans mon univers littéraire'}
                  </p>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-amber-700 leading-relaxed font-serif">
                  {data?.courte_biographie || 'Plongez dans un univers littéraire unique et découvrez des récits qui vous transporteront dans des mondes extraordinaires.'}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Link
                  to="/livres"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-amber-900"
                >
                  Découvrir mes œuvres
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link
                  to="/biographie"
                  className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border-2 border-amber-700 text-amber-800 rounded-lg hover:bg-amber-100 transition-all duration-300 font-serif font-semibold text-sm sm:text-base"
                >
                  Mon parcours
                </Link>
              </div>
            </div>
            
            <div className="lg:col-span-2 relative flex justify-center lg:justify-start mt-6 lg:mt-0">
              <div className="relative w-64 sm:w-80 md:w-96">
                {/* Cadre décoratif */}
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl opacity-30 blur-xl"></div>
                <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl shadow-2xl p-2 border-4 border-amber-200">
                  {data?.photo_auteur ? (
                    <img
                      src={data.photo_auteur}
                      alt={data?.nom_auteur || 'Auteur'}
                      className="rounded-xl w-full object-cover aspect-[3/4] shadow-lg sepia-[0.2]"
                    />
                  ) : (
                    <div className="rounded-xl w-full aspect-[3/4] bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                      <Feather className="w-16 h-16 text-amber-700 opacity-50" />
                    </div>
                  )}
                  {/* Ornements décoratifs */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-amber-600 rounded-full opacity-70"></div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-600 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-600 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-amber-700 rounded-full opacity-70"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Livre mis en avant */}
      {data?.livre_mis_en_avant && (
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20">
          <div className="text-center mb-8 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 rounded-full text-xs sm:text-sm font-serif font-semibold mb-4 border border-orange-200">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              Sélection littéraire
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-amber-900 mb-3 md:mb-4">Œuvre en lumière</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-700 max-w-2xl mx-auto font-serif italic">Découvrez ma dernière création littéraire</p>
          </div>
          <FeaturedBook book={data.livre_mis_en_avant} />
        </div>
      )}

      {/* Section avantages */}
      <div className="bg-gradient-to-br from-orange-100 via-amber-100 to-yellow-100 py-12 md:py-20 border-t border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-3 md:mb-4">L'art de la littérature</h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-700 max-w-2xl mx-auto font-serif italic">Une expérience de lecture raffinée vous attend</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-amber-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <Feather className="w-6 h-6 sm:w-8 sm:h-8 text-amber-800" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-amber-900 mb-3 md:mb-4 text-center">Prose Élégante</h3>
              <p className="text-sm sm:text-base text-amber-700 leading-relaxed font-serif text-center">Des récits ciselés avec soin, où chaque mot trouve sa place dans l'harmonie du texte</p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-orange-800" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-amber-900 mb-3 md:mb-4 text-center">Édition Soignée</h3>
              <p className="text-sm sm:text-base text-amber-700 leading-relaxed font-serif text-center">Chaque ouvrage est présenté avec le raffinement qu'il mérite</p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-yellow-50 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-yellow-200">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-full flex items-center justify-center mb-4 md:mb-6 mx-auto">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-800" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-amber-900 mb-3 md:mb-4 text-center">Lecture Immersive</h3>
              <p className="text-sm sm:text-base text-amber-700 leading-relaxed font-serif text-center">Laissez-vous emporter dans des univers où l'imagination n'a pas de limites</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-gradient-to-br from-amber-800 to-orange-900 py-12 md:py-20 relative overflow-hidden">
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-4xl sm:text-6xl text-white">❦</div>
          <div className="absolute bottom-10 right-10 text-3xl sm:text-5xl text-white">❧</div>
        </div>
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-100 mb-4 md:mb-6">
            Prêt à explorer mon univers littéraire ?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-200 mb-6 md:mb-8 leading-relaxed font-serif italic max-w-3xl mx-auto">
            Embarquez pour un voyage au cœur de récits qui réveilleront votre âme et nourriront votre esprit
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              to="/livres"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white text-amber-800 rounded-lg hover:bg-amber-50 transition-all duration-300 font-serif font-semibold text-sm sm:text-base lg:text-lg shadow-lg border border-amber-200"
            >
              Parcourir la bibliothèque
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-lg hover:bg-white hover:text-amber-800 transition-all duration-300 font-serif font-semibold text-sm sm:text-base lg:text-lg"
            >
              Correspondance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedBook({ book }: { book: Livre }) {
  return (
    <div className="bg-gradient-to-br from-white to-amber-50 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-amber-200">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        <div className="lg:col-span-2 relative group p-6 md:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 opacity-50"></div>
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Cadre décoratif pour le livre */}
              <div className="absolute -inset-3 bg-gradient-to-br from-amber-300 to-orange-300 rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-2 border-2 border-amber-300">
                <img
                  src={book.couverture || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop'}
                  alt={book.titre}
                  className="rounded-lg shadow-xl w-full max-w-[200px] sm:max-w-[250px] object-cover aspect-[3/4] transform group-hover:scale-105 transition-transform duration-300 sepia-[0.1]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop';
                  }}
                />
              </div>
              {/* Ornements */}
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-amber-600 rounded-full opacity-70"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-600 rounded-full opacity-70"></div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3 p-6 md:p-8 lg:p-12 flex flex-col justify-center space-y-4 md:space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800 rounded-full text-xs sm:text-sm font-serif font-semibold mb-3 md:mb-4 border border-orange-200">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
              Coup de cœur
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-amber-900 mb-3 md:mb-4 leading-tight">
              {book.titre}
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-amber-700 leading-relaxed mb-4 md:mb-6 font-serif">
              {book.resume_court || 'Découvrez cette œuvre captivante qui vous emmènera dans une aventure littéraire inoubliable...'}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
            {book.statut === 'gratuit' ? (
              <>
                <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl font-serif font-bold text-sm md:text-base lg:text-lg border border-green-200">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Lecture libre
                </div>
                <Link
                  to={`/livres/${book._id || book.id}`}
                  className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2 md:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-sm md:text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-amber-900"
                >
                  Lire maintenant
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={`/livres/${book._id || book.id}`}
                  className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-8 py-2 md:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-sm md:text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-amber-900"
                >
                  Acquérir l'ouvrage
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
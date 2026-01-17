import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, Euro, Gift, Search, Filter, Star } from 'lucide-react';
import { publicAPI } from '../lib/api';
import { Livre } from '../types';

export function Livres() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'tous' | 'gratuit' | 'payant'>('tous');

  useEffect(() => {
    const loadLivres = async () => {
      try {
        setLoading(true);
        console.log('Chargement des livres...');
        const response = await publicAPI('books');
        console.log('Réponse complète:', response);
        
        if (response && response.data && Array.isArray(response.data)) {
          console.log('Livres extraits:', response.data);
          setLivres(response.data);
        } else {
          console.error('Format de réponse inattendu:', response);
          setLivres([]);
        }
      } catch (err) {
        console.error('Erreur chargement livres:', err);
        setLivres([]);
      } finally {
        setLoading(false);
      }
    };
    loadLivres();
  }, []);

  const filteredLivres = livres.filter(livre => {
    const matchesSearch = livre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         livre.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'tous' || livre.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 py-4 sm:py-6 md:py-8 lg:py-10 border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-800" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-amber-700 font-serif mb-0.5 sm:mb-1">Bibliothèque littéraire</p>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-amber-900 leading-tight">
                Mes Œuvres
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 shadow-md sm:shadow-lg border border-amber-200 sm:border-2 mb-4 sm:mb-6 md:mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 sm:pl-8 md:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 md:py-3 border border-amber-200 sm:border-2 rounded-lg sm:rounded-xl focus:border-amber-500 focus:outline-none font-serif text-sm sm:text-base text-amber-900 placeholder-amber-500 bg-white"
              />
            </div>

            {/* Filtre par statut */}
            <div className="relative sm:w-auto">
              <Filter className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'tous' | 'gratuit' | 'payant')}
                className="w-full sm:w-auto pl-7 sm:pl-8 md:pl-10 pr-6 sm:pr-8 py-2 sm:py-2.5 md:py-3 border border-amber-200 sm:border-2 rounded-lg sm:rounded-xl focus:border-amber-500 focus:outline-none font-serif text-sm sm:text-base text-amber-900 bg-white cursor-pointer"
              >
                <option value="tous">Toutes</option>
                <option value="gratuit">Gratuit</option>
                <option value="payant">Premium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {loading ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6 md:mb-8 lg:mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-sm sm:shadow-md border border-gray-200 text-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3 animate-pulse">
                </div>
                <div className="h-4 sm:h-5 md:h-6 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-3 sm:h-4 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6 md:mb-8 lg:mb-12">
            <div className="bg-gradient-to-br from-white to-green-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-sm sm:shadow-md border border-green-200 text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3">
                <Gift className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-green-700" />
              </div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-serif font-bold text-green-800">
                {livres.filter(l => l.statut === 'gratuit').length}
              </p>
              <p className="text-xs sm:text-sm text-green-600 font-serif">Gratuit</p>
            </div>

            <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-sm sm:shadow-md border border-amber-200 text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3">
                <Euro className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-amber-700" />
              </div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-serif font-bold text-amber-800">
                {livres.filter(l => l.statut === 'payant').length}
              </p>
              <p className="text-xs sm:text-sm text-amber-600 font-serif">Premium</p>
            </div>

            <div className="bg-gradient-to-br from-white to-orange-50 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 shadow-sm sm:shadow-md border border-orange-200 text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-orange-700" />
              </div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-serif font-bold text-orange-800">{livres.length}</p>
              <p className="text-xs sm:text-sm text-orange-600 font-serif">Total</p>
            </div>
          </div>
        )}

        {/* Liste des livres */}
        {filteredLivres.length === 0 ? (
          <div className="text-center py-6 sm:py-8 md:py-12 lg:py-16">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 text-amber-400 mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6" />
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-bold text-amber-800 mb-2 md:mb-4">
              Aucune œuvre trouvée
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-amber-600 font-serif px-4">
              Modifiez vos critères de recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {filteredLivres.map((livre) => (
              <BookCard key={livre._id || livre.id} livre={livre} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookCard({ livre }: { livre: Livre }) {
  const bookId = livre._id || livre.id;

  const handleDownload = () => {
    window.open(
      `https://motimpact-back.onrender.com/api/public/livres/${bookId}/telecharger`,
      '_blank'
    );
  };

  const handleBuy = () => {
    if (!livre.lien_telechargement) {
      alert("Lien d'achat indisponible pour ce livre.");
      return;
    }
    window.open(livre.lien_telechargement, '_blank');
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-amber-200 overflow-hidden group relative">
      {/* Badge vedette */}
      {livre.is_featured && (
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-serif font-bold shadow-lg">
          ★ Vedette
        </div>
      )}

      {/* Image de couverture */}
      <div className="relative aspect-[4/3] sm:aspect-[3/4] overflow-hidden">
        <img
          src={
            livre.couverture ||
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop'
          }
          alt={livre.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=500&fit=crop';
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badge statut sur l'image */}
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
          {livre.statut === 'gratuit' ? (
            <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-green-500 text-white rounded-full text-xs sm:text-sm font-serif font-bold shadow-lg">
              <Gift className="w-3 h-3 sm:w-4 sm:h-4" />
              Gratuit
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 bg-amber-500 text-white rounded-full text-xs sm:text-sm font-serif font-bold shadow-lg">
              <Euro className="w-3 h-3 sm:w-4 sm:h-4" />
              {livre.prix}€
            </span>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-3 sm:p-4 md:p-5">
        <h3 className="text-sm sm:text-base md:text-lg font-serif font-bold text-amber-900 mb-2 sm:mb-3 line-clamp-2 leading-tight">
          {livre.titre}
        </h3>

        <p className="text-xs sm:text-sm text-amber-700 font-serif mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
          {livre.description}
        </p>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          <Link
            to={`/livres/${bookId}`}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-300 font-serif font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Détails</span>
            <span className="sm:hidden">Voir</span>
          </Link>

          {/* Bouton action selon le statut */}
          {livre.statut === 'gratuit' ? (
            <button
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-serif font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Télécharger</span>
              <span className="sm:hidden">PDF</span>
            </button>
          ) : (
            <button
              onClick={handleBuy}
              className="flex-1 inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 font-serif font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Euro className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Acheter</span>
              <span className="sm:hidden">{livre.prix}€</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

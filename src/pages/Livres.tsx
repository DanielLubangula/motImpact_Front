import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Download, Euro, Gift, Search, Filter, Star } from 'lucide-react';
import { publicAPI } from '../lib/api';
import { Livre } from '../types';

export function Livres() {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'tous' | 'gratuit' | 'payant'>('tous');

  useEffect(() => {
    const loadLivres = async () => {
      try {
        const response = await publicAPI('books');
        setLivres(response.data || response.books || []);
      } catch (err) {
        console.error('Erreur chargement livres:', err);
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
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 py-6 sm:py-8 md:py-10 border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-amber-700 font-serif mb-1">Bibliothèque littéraire</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-900 leading-tight">
                Mes Œuvres
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12">
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-2 border-amber-200 mb-6 sm:mb-8 md:mb-12">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <input
                type="text"
                placeholder="Rechercher une œuvre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 border-amber-200 rounded-lg sm:rounded-xl focus:border-amber-500 focus:outline-none font-serif text-sm sm:text-base text-amber-900 placeholder-amber-500 bg-white"
              />
            </div>

            {/* Filtre par statut */}
            <div className="relative lg:w-auto">
              <Filter className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'tous' | 'gratuit' | 'payant')}
                className="w-full lg:w-auto pl-8 sm:pl-10 pr-6 sm:pr-8 py-2 sm:py-3 border-2 border-amber-200 rounded-lg sm:rounded-xl focus:border-amber-500 focus:outline-none font-serif text-sm sm:text-base text-amber-900 bg-white cursor-pointer"
              >
                <option value="tous">Toutes les œuvres</option>
                <option value="gratuit">Gratuit</option>
                <option value="payant">Œuvres premium</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-12">
          <div className="bg-gradient-to-br from-white to-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md border border-green-200 text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
              <Gift className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-700" />
            </div>
            <p className="text-base sm:text-lg md:text-2xl font-serif font-bold text-green-800">
              {livres.filter(l => l.statut === 'gratuit').length}
            </p>
            <p className="text-xs sm:text-sm md:text-base text-green-600 font-serif">Gratuit</p>
          </div>

          <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md border border-amber-200 text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
              <Euro className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-700" />
            </div>
            <p className="text-base sm:text-lg md:text-2xl font-serif font-bold text-amber-800">
              {livres.filter(l => l.statut === 'payant').length}
            </p>
            <p className="text-xs sm:text-sm md:text-base text-amber-600 font-serif">Œuvres premium</p>
          </div>

          <div className="bg-gradient-to-br from-white to-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md border border-orange-200 text-center">
            <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
              <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 text-orange-700" />
            </div>
            <p className="text-base sm:text-lg md:text-2xl font-serif font-bold text-orange-800">{livres.length}</p>
            <p className="text-xs sm:text-sm md:text-base text-orange-600 font-serif">Total des œuvres</p>
          </div>
        </div>

        {/* Liste des livres */}
        {filteredLivres.length === 0 ? (
          <div className="text-center py-8 md:py-12 lg:py-16">
            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-amber-400 mx-auto mb-3 md:mb-4 lg:mb-6" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-amber-800 mb-2 md:mb-4">
              Aucune œuvre trouvée
            </h3>
            <p className="text-sm sm:text-base text-amber-600 font-serif px-4">
              Essayez de modifier vos critères de recherche ou de filtrage.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
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
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200 overflow-hidden group">
      <div className="flex flex-col md:flex-row h-64 md:h-48">
        {/* Image de couverture */}
        <div className="relative w-full md:w-48 flex-shrink-0">
          {livre.is_featured && (
            <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-serif font-bold">
              ★ Vedette
            </div>
          )}
          <div className="h-full">
            <img
              src={livre.couverture || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop'}
              alt={livre.titre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop';
              }}
            />
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4 flex flex-col justify-between flex-1 min-h-0">
          <div className="flex-1">
            {/* Titre */}
            <h3 className="text-lg font-serif font-bold text-amber-900 mb-2 line-clamp-2">
              {livre.titre}
            </h3>

            {/* Description */}
            <p className="text-amber-700 font-serif text-sm leading-relaxed mb-3 line-clamp-2">
              {livre.description}
            </p>

            {/* Prix */}
            <div className="mb-3">
              {livre.statut === 'gratuit' ? (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-serif font-semibold">
                  <Gift className="w-3 h-3" />
                  Gratuit
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-serif font-semibold">
                  <Euro className="w-3 h-3" />
                  {livre.prix}€
                </span>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-2">
            <Link
              to={`/livres/${livre._id || livre.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-serif font-semibold text-sm"
            >
              <BookOpen className="w-3 h-3" />
              Voir
            </Link>
            
            {livre.statut === 'gratuit' && (
              <button 
                onClick={() => window.open(`http://localhost:5000/api/public/livres/${livre._id || livre.id}/telecharger`, '_blank')}
                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 border border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-serif font-semibold text-sm"
              >
                <Download className="w-3 h-3" />
                PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
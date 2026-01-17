import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Feather, Search, Filter, ExternalLink } from 'lucide-react';
import { publicAPI } from '../lib/api';
import { Actualite } from '../types';

export function Actualites() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('tous');

  useEffect(() => {
    const loadActualites = async () => {
      try {
        const response = await publicAPI('actus');
        console.log('Response actualités:', response); // Debug
        const actualitesData = response.data?.actus || response.actus || [];
        setActualites(actualitesData);
      } catch (err) {
        console.error('Erreur chargement actualités:', err);
      } finally {
        setLoading(false);
      }
    };
    loadActualites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-amber-700 font-serif">Chargement des actualités...</p>
        </div>
      </div>
    );
  }

  const filteredActualites = Array.isArray(actualites) ? actualites.filter(actualite => {
    const matchesSearch = actualite.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         actualite.contenu.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedMonth === 'tous') return matchesSearch;
    
    const actualiteMonth = new Date(actualite.created_at).getMonth();
    const filterMonth = parseInt(selectedMonth);
    
    return matchesSearch && actualiteMonth === filterMonth;
  }) : [];

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
              <p className="text-xs sm:text-sm text-amber-700 font-serif mb-1">Chroniques littéraires</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-900 leading-tight">
                Actualités
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20">
        {/* Filtres et recherche */}
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border-2 border-amber-200 mb-8 sm:mb-12 md:mb-16">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Barre de recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <input
                type="text"
                placeholder="Rechercher une actualité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 border-amber-200 rounded-lg sm:rounded-xl focus:border-amber-500 focus:outline-none font-serif text-sm sm:text-base text-amber-900 placeholder-amber-500 bg-white"
              />
            </div>

            {/* Filtre par mois */}
            <div className="relative lg:w-auto">
              <Filter className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full lg:w-auto pl-8 sm:pl-10 pr-6 sm:pr-8 py-2 sm:py-3 border-2 border-amber-200 rounded-lg sm:rounded-xl focus:border-amber-500 focus:outline-none font-serif text-sm sm:text-base text-amber-900 bg-white cursor-pointer"
              >
                <option value="tous">Tous les mois</option>
                <option value="0">Janvier</option>
                <option value="1">Février</option>
                <option value="2">Mars</option>
                <option value="3">Avril</option>
                <option value="4">Mai</option>
                <option value="5">Juin</option>
                <option value="6">Juillet</option>
                <option value="7">Août</option>
                <option value="8">Septembre</option>
                <option value="9">Octobre</option>
                <option value="10">Novembre</option>
                <option value="11">Décembre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des actualités */}
        {filteredActualites.length === 0 ? (
          <div className="text-center py-12 md:py-16 lg:py-20">
            <Feather className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-amber-400 mx-auto mb-4 md:mb-6" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-amber-800 mb-2 md:mb-4">
              Aucune actualité trouvée
            </h3>
            <p className="text-sm sm:text-base text-amber-600 font-serif px-4">
              Essayez de modifier vos critères de recherche ou de filtrage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredActualites.map((actualite, index) => (
              <ActualiteCard key={actualite._id || actualite.id} actualite={actualite} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActualiteCard({ actualite, index }: { actualite: Actualite; index: number }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <article className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-amber-200 overflow-hidden group h-full flex flex-col">
      {/* Image */}
      {actualite.image && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={actualite.image} 
            alt={actualite.titre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-1">
        {/* Métadonnées */}
        <div className="flex items-center gap-4 text-xs text-amber-600 font-serif mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(actualite.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{Math.floor(Math.random() * 500) + 100}</span>
          </div>
        </div>

        {/* Titre */}
        <h2 className="text-lg font-serif font-bold text-amber-900 mb-3 leading-tight group-hover:text-amber-800 transition-colors line-clamp-2">
          {actualite.titre}
        </h2>

        {/* Extrait */}
        <p className="text-sm text-amber-700 font-serif leading-relaxed mb-4 flex-1">
          {getPreview(actualite.contenu, 120)}
        </p>

        {/* Bouton */}
        <Link
          to={`/actualites/${actualite._id || actualite.id}`}
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-sm shadow-md hover:shadow-lg"
        >
          Lire l'article
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}
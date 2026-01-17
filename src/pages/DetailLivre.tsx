// import { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { ArrowLeft, BookOpen, Download, Euro, Gift, Calendar, Star, Quote } from 'lucide-react';
// import { publicAPI } from '../lib/api';
// import { Livre } from '../types';

// export function DetailLivre() {
//   const { id } = useParams<{ id: string }>();
//   const [livre, setLivre] = useState<Livre | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadLivre = async () => {
//       if (!id) return;
      
//       try {
//         const response = await publicAPI(`books/${id}`);
//         setLivre(response.data);
//       } catch (err) {
//         console.error('Erreur chargement livre:', err);
//         setLivre(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadLivre();
//   }, [id]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
//           <p className="text-sm sm:text-base text-amber-700 font-serif">Chargement de l'œuvre...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!livre) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
//         <div className="text-center">
//           <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-amber-400 mx-auto mb-4 sm:mb-6" />
//           <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-amber-800 mb-3 sm:mb-4">Œuvre introuvable</h2>
//           <p className="text-sm sm:text-base text-amber-600 font-serif mb-4 sm:mb-6">Cette œuvre n'existe pas ou n'est plus disponible.</p>
//           <Link
//             to="/livres"
//             className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-sm sm:text-base"
//           >
//             <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//             Retour à la bibliothèque
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
//       {/* Navigation de retour */}
//       <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-200 py-3 sm:py-4">
//         <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
//           <Link
//             to="/livres"
//             className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors font-serif font-medium text-sm sm:text-base"
//           >
//             <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//             <span className="hidden sm:inline">Retour à la bibliothèque</span>
//             <span className="sm:hidden">Retour</span>
//           </Link>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
//           {/* Image de couverture */}
//           <div className="lg:col-span-2">
//             <div className="lg:sticky lg:top-8 max-w-sm mx-auto lg:max-w-none">
//               <div className="relative">
//                 {livre.is_featured && (
//                   <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-serif font-bold flex items-center gap-1 sm:gap-2 shadow-lg">
//                     <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
//                     <span className="hidden sm:inline">Coup de cœur</span>
//                     <span className="sm:hidden">Top</span>
//                   </div>
//                 )}
                
//                 {/* Cadre décoratif */}
//                 <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl sm:rounded-3xl opacity-30 blur-lg sm:blur-xl"></div>
//                 <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-2 sm:p-3 border-2 sm:border-3 md:border-4 border-amber-200">
//                   <img
//                     src={livre.couverture}
//                     alt={livre.titre}
//                     className="w-full rounded-lg sm:rounded-xl shadow-lg aspect-[3/4] object-cover sepia-[0.1]"
//                     onError={(e) => {
//                       const target = e.target as HTMLImageElement;
//                       target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';
//                     }}
//                   />
                  
//                   {/* Ornements décoratifs */}
//                   <div className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 bg-amber-600 rounded-full opacity-70"></div>
//                   <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-orange-600 rounded-full opacity-70"></div>
//                   <div className="absolute -bottom-1.5 -left-1.5 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-600 rounded-full opacity-70"></div>
//                   <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-amber-700 rounded-full opacity-70"></div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Contenu principal */}
//           <div className="lg:col-span-3 space-y-4 sm:space-y-6 md:space-y-8">
//             {/* En-tête */}
//             <div>
//               <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-amber-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
//                 {livre.titre}
//               </h1>
              
//               <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
//                 {/* Statut et prix */}
//                 {livre.statut === 'gratuit' ? (
//                   <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full font-serif font-bold border border-green-200 text-xs sm:text-sm md:text-base">
//                     <Gift className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
//                     <span className="hidden sm:inline">Lecture libre</span>
//                     <span className="sm:hidden">Gratuit</span>
//                   </div>
//                 ) : (
//                   <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full font-serif font-bold border border-amber-200 text-xs sm:text-sm md:text-base">
//                     <Euro className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
//                     {livre.prix}€
//                   </div>
//                 )}

//                 {/* Date de publication */}
//                 <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full font-serif border border-gray-300 text-xs sm:text-sm">
//                   <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
//                   <span className="hidden md:inline">
//                     {new Date(livre.created_at).toLocaleDateString('fr-FR', { 
//                       year: 'numeric', 
//                       month: 'long', 
//                       day: 'numeric' 
//                     })}
//                   </span>
//                   <span className="md:hidden">
//                     {new Date(livre.created_at).toLocaleDateString('fr-FR', { 
//                       year: 'numeric', 
//                       month: 'short'
//                     })}
//                   </span>
//                 </div>
//               </div>

//               {/* Résumé court */}
//               <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-700 font-serif italic leading-relaxed mb-4 sm:mb-6 md:mb-8">
//                 {livre.description}
//               </p>

//               {/* Actions */}
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
//                 {livre.statut === 'gratuit' ? (
//                   <button 
//                     onClick={() => window.open(`https://motimpact-back.onrender.com//api/public/livres/${livre._id || livre.id}/telecharger`, '_blank')}
//                     className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg sm:rounded-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-sm sm:text-base md:text-lg shadow-lg"
//                   >
//                     <Download className="w-4 h-4 sm:w-5 sm:h-5" />
//                     <span className="hidden sm:inline">Télécharger PDF</span>
//                     <span className="sm:hidden">PDF</span>
//                   </button>
//                 ) : (
//                   <>
//                     <button className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg sm:rounded-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-sm sm:text-base md:text-lg shadow-lg">
//                       <Euro className="w-4 h-4 sm:w-5 sm:h-5" />
//                       <span className="hidden sm:inline">Acquérir l'ouvrage</span>
//                       <span className="sm:hidden">Acheter</span>
//                     </button>
//                     <button className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border-2 border-amber-700 text-amber-800 rounded-lg sm:rounded-xl hover:bg-amber-100 transition-all duration-300 font-serif font-semibold text-sm sm:text-base md:text-lg">
//                       <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
//                       <span className="hidden sm:inline">Aperçu gratuit</span>
//                       <span className="sm:hidden">Aperçu</span>
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Description complète */}
//             <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-md sm:shadow-lg border border-amber-200 sm:border-2">
//               <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-amber-900 mb-3 sm:mb-4 md:mb-6">
//                 À propos de cette œuvre
//               </h2>
//               <div className="prose prose-amber max-w-none">
//                 {livre.description && livre.description.split('\n\n').map((paragraph, index) => (
//                   <p key={index} className="text-sm sm:text-base md:text-lg text-amber-800 font-serif leading-relaxed mb-3 sm:mb-4 last:mb-0">
//                     {paragraph}
//                   </p>
//                 ))}
//               </div>
//             </div>

//             {/* Extrait */}
//             {livre.extrait && (
//               <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-md sm:shadow-lg border border-orange-200 sm:border-2 relative">
//                 <Quote className="absolute top-3 left-3 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-orange-300 opacity-50" />
//                 <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-amber-900 mb-3 sm:mb-4 md:mb-6 pl-6 sm:pl-8 md:pl-10 lg:pl-12">
//                   Extrait
//                 </h2>
//                 <div className="pl-6 sm:pl-8 md:pl-10 lg:pl-12">
//                   {livre.extrait && livre.extrait.split('\n\n').map((paragraph, index) => (
//                     <p key={index} className="text-sm sm:text-base md:text-lg text-amber-800 font-serif italic leading-relaxed mb-3 sm:mb-4 last:mb-0">
//                       {paragraph}
//                     </p>
//                   ))}
//                 </div>
//                 <div className="text-right mt-4 sm:mt-6">
//                   <span className="text-amber-700 font-serif italic text-sm sm:text-base">— Enock</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, Euro, Gift, Calendar, Star, Quote } from 'lucide-react';
import { publicAPI } from '../lib/api';
import { Livre } from '../types';

export function DetailLivre() {
  const { id } = useParams<{ id: string }>();
  const [livre, setLivre] = useState<Livre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLivre = async () => {
      if (!id) return;
      
      try {
        const response = await publicAPI(`books/${id}`);
        setLivre(response.data);
      } catch (err) {
        console.error('Erreur chargement livre:', err);
        setLivre(null);
      } finally {
        setLoading(false);
      }
    };
    loadLivre();
  }, [id]);

  // Fonction pour télécharger le livre gratuit
  const handleDownload = () => {
    if (!livre) return;
    window.open(
      `https://motimpact-back.onrender.com//api/public/livres/${livre._id || livre.id}/telecharger`,
      '_blank'
    );
  };

  // Fonction pour acheter le livre payant
  const handleBuy = () => {
    if (!livre) return;
    
    if (!livre.lien_telechargement) {
      alert("Lien d'achat indisponible pour ce livre.");
      return;
    }
    
    // Ouvrir le lien Maketou dans un nouvel onglet
    window.open(livre.lien_telechargement, '_blank');
  };

  // Fonction pour l'aperçu gratuit (pour les livres payants)
  const handlePreview = () => {
    if (!livre) return;
    
    if (livre.statut === 'gratuit') {
      // Pour les livres gratuits, télécharger directement
      handleDownload();
    } else {
      // Pour les livres payants, ouvrir l'extrait ou un aperçu
      if (livre.extrait) {
        // Vous pourriez ouvrir une modal avec l'extrait ici
        alert("Aperçu de l'extrait disponible");
      } else {
        alert("Aucun aperçu disponible pour ce livre.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-amber-700 font-serif">Chargement de l'œuvre...</p>
        </div>
      </div>
    );
  }

  if (!livre) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
        <div className="text-center">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-amber-400 mx-auto mb-4 sm:mb-6" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-amber-800 mb-3 sm:mb-4">Œuvre introuvable</h2>
          <p className="text-sm sm:text-base text-amber-600 font-serif mb-4 sm:mb-6">Cette œuvre n'existe pas ou n'est plus disponible.</p>
          <Link
            to="/livres"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Retour à la bibliothèque
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Navigation de retour */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-200 py-3 sm:py-4">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12">
          <Link
            to="/livres"
            className="inline-flex items-center gap-2 text-amber-800 hover:text-amber-900 transition-colors font-serif font-medium text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Retour à la bibliothèque</span>
            <span className="sm:hidden">Retour</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {/* Image de couverture */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8 max-w-sm mx-auto lg:max-w-none">
              <div className="relative">
                {livre.is_featured && (
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-serif font-bold flex items-center gap-1 sm:gap-2 shadow-lg">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                    <span className="hidden sm:inline">Coup de cœur</span>
                    <span className="sm:hidden">Top</span>
                  </div>
                )}
                
                {/* Cadre décoratif */}
                <div className="absolute -inset-2 sm:-inset-3 md:-inset-4 bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl sm:rounded-3xl opacity-30 blur-lg sm:blur-xl"></div>
                <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-2 sm:p-3 border-2 sm:border-3 md:border-4 border-amber-200">
                  <img
                    src={livre.couverture}
                    alt={livre.titre}
                    className="w-full rounded-lg sm:rounded-xl shadow-lg aspect-[3/4] object-cover sepia-[0.1]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop';
                    }}
                  />
                  
                  {/* Ornements décoratifs */}
                  <div className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-4 h-4 sm:w-6 sm:h-6 bg-amber-600 rounded-full opacity-70"></div>
                  <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-orange-600 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-yellow-600 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-amber-700 rounded-full opacity-70"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 md:space-y-8">
            {/* En-tête */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold text-amber-900 mb-3 sm:mb-4 md:mb-6 leading-tight">
                {livre.titre}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                {/* Statut et prix */}
                {livre.statut === 'gratuit' ? (
                  <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full font-serif font-bold border border-green-200 text-xs sm:text-sm md:text-base">
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Lecture libre</span>
                    <span className="sm:hidden">Gratuit</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full font-serif font-bold border border-amber-200 text-xs sm:text-sm md:text-base">
                    <Euro className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    {livre.prix}€
                  </div>
                )}

                {/* Date de publication */}
                <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-full font-serif border border-gray-300 text-xs sm:text-sm">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden md:inline">
                    {new Date(livre.created_at).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <span className="md:hidden">
                    {new Date(livre.created_at).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'short'
                    })}
                  </span>
                </div>
              </div>

              {/* Résumé court */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-amber-700 font-serif italic leading-relaxed mb-4 sm:mb-6 md:mb-8">
                {livre.description}
              </p>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                {livre.statut === 'gratuit' ? (
                  <button 
                    onClick={handleDownload}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg sm:rounded-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Télécharger PDF</span>
                    <span className="sm:hidden">PDF</span>
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={handleBuy}
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg sm:rounded-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl active:scale-95"
                    >
                      <Euro className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Acquérir l'ouvrage</span>
                      <span className="sm:hidden">Acheter</span>
                    </button>
                    <button 
                      onClick={handlePreview}
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 border-2 border-amber-700 text-amber-800 rounded-lg sm:rounded-xl hover:bg-amber-100 transition-all duration-300 font-serif font-semibold text-sm sm:text-base md:text-lg active:scale-95"
                    >
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Aperçu gratuit</span>
                      <span className="sm:hidden">Aperçu</span>
                    </button>
                  </>
                )}
              </div>

              {/* Message d'info pour les livres payants */}
              {livre.statut === 'payant' && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <p className="text-xs sm:text-sm text-amber-700 font-serif">
                    {livre.lien_telechargement 
                      ? "Le bouton 'Acquérir l'ouvrage' vous redirigera vers notre partenaire Maketou pour le paiement sécurisé."
                      : "Ce livre est en vente. Contactez-nous pour plus d'informations sur l'acquisition."}
                  </p>
                </div>
              )}
            </div>

            {/* Description complète */}
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-md sm:shadow-lg border border-amber-200 sm:border-2">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-amber-900 mb-3 sm:mb-4 md:mb-6">
                À propos de cette œuvre
              </h2>
              <div className="prose prose-amber max-w-none">
                {livre.description && livre.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-sm sm:text-base md:text-lg text-amber-800 font-serif leading-relaxed mb-3 sm:mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Extrait */}
            {livre.extrait && (
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-md sm:shadow-lg border border-orange-200 sm:border-2 relative">
                <Quote className="absolute top-3 left-3 sm:top-4 sm:left-4 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-orange-300 opacity-50" />
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-amber-900 mb-3 sm:mb-4 md:mb-6 pl-6 sm:pl-8 md:pl-10 lg:pl-12">
                  Extrait
                </h2>
                <div className="pl-6 sm:pl-8 md:pl-10 lg:pl-12">
                  {livre.extrait && livre.extrait.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-sm sm:text-base md:text-lg text-amber-800 font-serif italic leading-relaxed mb-3 sm:mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="text-right mt-4 sm:mt-6">
                  <span className="text-amber-700 font-serif italic text-sm sm:text-base">— Enock</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
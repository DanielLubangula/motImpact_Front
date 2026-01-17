import { Link } from 'react-router-dom';
import { Home, BookOpen, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Motifs décoratifs */}
        <div className="relative mb-6 sm:mb-8">
          <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 text-3xl sm:text-4xl md:text-6xl text-amber-300 opacity-50">❦</div>
          <div className="absolute -top-1 sm:-top-2 -right-3 sm:-right-6 text-2xl sm:text-3xl md:text-4xl text-orange-300 opacity-50">✦</div>
          <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold text-amber-800 mb-3 sm:mb-4">404</div>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-3 sm:mb-4 px-2">
            Page introuvable
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-amber-700 font-serif italic leading-relaxed mb-4 sm:mb-6 px-2">
            "Comme un livre égaré dans une bibliothèque infinie, cette page semble avoir perdu son chemin..."
          </p>
          <p className="text-sm sm:text-base text-amber-600 font-serif px-2">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg sm:rounded-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
            Retour à l'accueil
          </Link>
          
          <Link
            to="/livres"
            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border-2 border-amber-700 text-amber-800 rounded-lg sm:rounded-xl hover:bg-amber-100 transition-all duration-300 font-serif font-semibold text-sm sm:text-base"
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            Découvrir les œuvres
          </Link>
        </div>

        <div className="mt-8 sm:mt-12 text-center px-2">
          <div className="inline-flex items-center gap-2 text-amber-600 font-serif italic text-sm sm:text-base">
            <span className="text-lg sm:text-xl md:text-2xl">✧</span>
            <span className="text-center">"Chaque détour mène à une nouvelle découverte"</span>
            <span className="text-lg sm:text-xl md:text-2xl">✧</span>
          </div>
        </div>
      </div>
    </div>
  );
}
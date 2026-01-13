import { Link } from 'react-router-dom';
import { Home, BookOpen, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Motifs décoratifs */}
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 text-6xl text-amber-300 opacity-50">❦</div>
          <div className="absolute -top-2 -right-6 text-4xl text-orange-300 opacity-50">✦</div>
          <div className="text-8xl md:text-9xl font-serif font-bold text-amber-800 mb-4">404</div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-4">
            Page introuvable
          </h1>
          <p className="text-lg md:text-xl text-amber-700 font-serif italic leading-relaxed mb-6">
            "Comme un livre égaré dans une bibliothèque infinie, cette page semble avoir perdu son chemin..."
          </p>
          <p className="text-base text-amber-600 font-serif">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-xl hover:from-amber-800 hover:to-amber-900 transition-all duration-300 font-serif font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </Link>
          
          <Link
            to="/livres"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-amber-700 text-amber-800 rounded-xl hover:bg-amber-100 transition-all duration-300 font-serif font-semibold"
          >
            <BookOpen className="w-5 h-5" />
            Découvrir les œuvres
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-amber-600 font-serif italic">
            <span className="text-2xl">✧</span>
            <span>"Chaque détour mène à une nouvelle découverte"</span>
            <span className="text-2xl">✧</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import logoImage from '../logo/logo.jpg';
import { useUnreadMessages } from '../hooks/useUnreadMessages';

interface NavigationProps {
  isAdmin?: boolean;
  onLogout?: () => void;
  adminToken?: string | null;
}

export function Navigation({ isAdmin = false, onLogout, adminToken }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const { unreadCount } = useUnreadMessages(isAdmin ? adminToken : null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 border-b-2 border-amber-200 shadow-lg" ref={menuRef}>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link to={isAdmin ? '/admin/dashboard' : '/'} className="flex items-center gap-2 md:gap-3">
            <img 
              src={logoImage} 
              alt="MotImpact Logo" 
              className="w-8 h-8 md:w-20 md:h-20 rounded-full object-cover"
            />
            <span className="text-lg md:text-2xl font-serif font-bold text-amber-900">MotImpact</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-amber-100 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6 text-amber-800" /> : <Menu className="w-6 h-6 text-amber-800" />}
          </button>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {!isAdmin ? (
              <>
                <Link to="/" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                  isActive('/') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
                }`}>
                  Accueil
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                    isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link to="/biographie" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                  isActive('/biographie') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
                }`}>
                  Biographie
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                    isActive('/biographie') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link to="/livres" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                  isActive('/livres') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
                }`}>
                  Œuvres
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                    isActive('/livres') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link to="/actualites" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                  isActive('/actualites') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
                }`}>
                  Actualités
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                    isActive('/actualites') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link to="/contact" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                  isActive('/contact') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
                }`}>
                  Correspondance
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                    isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/admin/dashboard" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                  isActive('/admin/dashboard') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
                }`}>
                  Tableau de bord
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                    isActive('/admin/dashboard') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link to="/admin/livres" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                  isActive('/admin/livres') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
                }`}>
                  Livres
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                    isActive('/admin/livres') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link to="/admin/actualites" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                  isActive('/admin/actualites') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
                }`}>
                  Actualités
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                    isActive('/admin/actualites') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link to="/admin/messages" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                  isActive('/admin/messages') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
                }`}>
                  <div className="relative inline-flex items-center">
                    Messages
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                    isActive('/admin/messages') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <Link to="/admin/profil" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                  isActive('/admin/profil') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
                }`}>
                  Profil
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                    isActive('/admin/profil') ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
                <button
                  onClick={onLogout}
                  className="px-3 lg:px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-serif font-medium text-sm lg:text-base flex items-center gap-2 shadow-md"
                >
                  <LogOut className="w-3 h-3 lg:w-4 lg:h-4" />
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pb-4 space-y-1 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg mt-2 p-4 border border-amber-200">
            {!isAdmin ? (
              <>
                <Link
                  to="/"
                  className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                    isActive('/') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Accueil
                </Link>
                <Link
                  to="/biographie"
                  className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                    isActive('/biographie') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Biographie
                </Link>
                <Link
                  to="/livres"
                  className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                    isActive('/livres') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Œuvres
                </Link>
                <Link
                  to="/actualites"
                  className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                    isActive('/actualites') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Actualités
                </Link>
                <Link
                  to="/contact"
                  className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                    isActive('/contact') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Correspondance
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                    isActive('/admin/dashboard') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Tableau de bord
                </Link>
                <Link
                  to="/admin/livres"
                  className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                    isActive('/admin/livres') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Livres
                </Link>
                <Link
                  to="/admin/actualites"
                  className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                    isActive('/admin/actualites') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Actualités
                </Link>
                <Link
                  to="/admin/messages"
                  className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                    isActive('/admin/messages') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative inline-flex items-center">
                    Messages
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
                <Link
                  to="/admin/profil"
                  className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                    isActive('/admin/profil') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Profil
                </Link>
                <button
                  onClick={() => {
                    onLogout?.();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-serif font-medium"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
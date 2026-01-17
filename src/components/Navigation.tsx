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
        <div className="flex justify-between items-center h-16">
          <Link to={isAdmin ? '/admin/dashboard' : '/'} className="flex items-center gap-2 md:gap-3">
            <img 
              src={logoImage} 
              alt="MotImpact Logo" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-md"
            />
            <span className="text-lg md:text-xl font-serif font-bold text-amber-900">MotImpact</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-amber-100 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6 text-amber-800" /> : <Menu className="w-6 h-6 text-amber-800" />}
          </button>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
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
            
            {/* Lien Dashboard visible uniquement si admin connecté */}
            {isAdmin && (
              <Link to="/admin/dashboard" className={`transition-colors font-serif font-medium text-sm lg:text-base relative group ${
                isActive('/admin/dashboard') ? 'text-amber-900 font-semibold' : 'text-amber-800 hover:text-amber-900'
              }`}>
                Dashboard
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-amber-600 transition-all ${
                  isActive('/admin/dashboard') ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
              </Link>
            )}
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pb-4 space-y-1 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg mt-2 p-4 border border-amber-200">
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
            
            {/* Lien Dashboard visible uniquement si admin connecté */}
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`block px-3 py-2 rounded-lg font-serif font-medium transition-colors ${
                  isActive('/admin/dashboard') ? 'bg-amber-200 text-amber-900 font-semibold' : 'text-amber-800 hover:bg-amber-100'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
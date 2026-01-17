import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Shield
} from 'lucide-react';
import { adminAPI } from '../../lib/api';
import { useMessageNotifications } from '../../hooks/useMessageNotifications';
import { MessageNotificationBadge } from '../../components/MessageNotificationBadge';

interface AdminDashboardProps {
  token: string;
}

interface DashboardData {
  nombre_livres: number;
  nombre_ventes: number;
  nombre_messages: number;
  statistiques_simples: {
    ventes_last_7_days: Array<{
      _id: string;
      count: number;
      totalAmount: number;
    }>;
    revenus_total: number;
    ventes_ce_mois: number;
    livres_gratuits: number;
    livres_payants: number;
  };
}

export function AdminDashboard({ token }: AdminDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { unreadCount, markAsChecked } = useMessageNotifications(token);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminAPI('dashboard', 'GET', undefined, token);
        
        if (response.status === 'success' && response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
        // Si erreur d'authentification, rediriger vers login
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-slate-900">Admin MotImpact</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/"
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 text-xs sm:text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden sm:inline">Retour au site</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2 text-xs sm:text-sm bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md font-medium"
              >
                <LogOut className="w-4 h-4 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-16 sm:pt-20 lg:pt-24">
        {/* Navigation Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <Link
            to="/admin/livres"
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Livres</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">{data?.nombre_livres || 0}</p>
              </div>
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 group-hover:text-blue-700" />
            </div>
          </Link>

          <Link
            to="/admin/messages"
            onClick={markAsChecked}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow group relative"
          >
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Messages</p>
                {unreadCount > 0 && (
                  <p className="text-xs text-red-600 font-medium mt-1">
                    {unreadCount} nouveau(x)
                  </p>
                )}
              </div>
              <div className="relative">
                <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 group-hover:text-green-700" />
                <MessageNotificationBadge count={unreadCount} />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/actualites"
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Actualités</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">Gérer</p>
              </div>
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 group-hover:text-purple-700" />
            </div>
          </Link>

          <Link
            to="/admin/profil"
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-0">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-slate-600">Profil</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-900">Config</p>
              </div>
              <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 group-hover:text-orange-700" />
            </div>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Books Stats */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">Catalogue</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <span className="block text-xs sm:text-sm text-slate-600 mb-1">Gratuits</span>
                <span className="block text-lg sm:text-xl font-semibold text-green-600">{data?.statistiques_simples?.livres_gratuits || 0}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs sm:text-sm text-slate-600 mb-1">Payants</span>
                <span className="block text-lg sm:text-xl font-semibold text-amber-600">{data?.statistiques_simples?.livres_payants || 0}</span>
              </div>
              <div className="text-center">
                <span className="block text-xs sm:text-sm text-slate-600 mb-1">Total</span>
                <span className="block text-lg sm:text-xl font-semibold text-slate-900">{data?.nombre_livres || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              to="/admin/livres"
              className="flex items-center gap-3 p-3 sm:p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium text-slate-700">Ajouter un livre</span>
            </Link>
            
            <Link
              to="/admin/actualites"
              className="flex items-center gap-3 p-3 sm:p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium text-slate-700">Nouvelle actu</span>
            </Link>
            
            <Link
              to="/admin/messages"
              onClick={markAsChecked}
              className="flex items-center gap-3 p-3 sm:p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors relative"
            >
              <div className="relative flex-shrink-0">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                <MessageNotificationBadge count={unreadCount} />
              </div>
              <span className="text-sm sm:text-base font-medium text-slate-700">
                Messages {unreadCount > 0 && `(${unreadCount})`}
              </span>
            </Link>
            
            <Link
              to="/admin/profil"
              className="flex items-center gap-3 p-3 sm:p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
              <span className="text-sm sm:text-base font-medium text-slate-700">Paramètres</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
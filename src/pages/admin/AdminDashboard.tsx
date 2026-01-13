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

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await adminAPI('dashboard', 'GET', undefined, token);
        setData(response.data);
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
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-slate-700" />
              <h1 className="text-xl font-bold text-slate-900">Administration MotImpact</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/admin/livres"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Livres</p>
                <p className="text-2xl font-bold text-slate-900">{data?.nombre_livres || 0}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600 group-hover:text-blue-700" />
            </div>
          </Link>

          <Link
            to="/admin/messages"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Messages</p>
                <p className="text-2xl font-bold text-slate-900">{data?.nombre_messages || 0}</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600 group-hover:text-green-700" />
            </div>
          </Link>

          <Link
            to="/admin/actualites"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Actualités</p>
                <p className="text-2xl font-bold text-slate-900">Gérer</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600 group-hover:text-purple-700" />
            </div>
          </Link>

          <Link
            to="/admin/profil"
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Profil</p>
                <p className="text-2xl font-bold text-slate-900">Config</p>
              </div>
              <Settings className="w-8 h-8 text-orange-600 group-hover:text-orange-700" />
            </div>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Ventes Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-900">Ventes</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Total ventes</span>
                <span className="font-semibold text-slate-900">{data?.nombre_ventes || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Ce mois</span>
                <span className="font-semibold text-slate-900">{data?.statistiques_simples?.ventes_ce_mois || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Revenus total</span>
                <span className="font-semibold text-emerald-600">{data?.statistiques_simples?.revenus_total || 0}€</span>
              </div>
            </div>
          </div>

          {/* Books Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">Catalogue</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Livres gratuits</span>
                <span className="font-semibold text-green-600">{data?.statistiques_simples?.livres_gratuits || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Livres payants</span>
                <span className="font-semibold text-amber-600">{data?.statistiques_simples?.livres_payants || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total</span>
                <span className="font-semibold text-slate-900">{data?.nombre_livres || 0}</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900">7 derniers jours</h3>
            </div>
            <div className="space-y-2">
              {data?.statistiques_simples?.ventes_last_7_days?.slice(0, 3).map((vente, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-slate-600">{new Date(vente._id).toLocaleDateString('fr-FR')}</span>
                  <span className="font-medium text-slate-900">{vente.count} vente(s)</span>
                </div>
              )) || (
                <p className="text-slate-500 text-sm">Aucune vente récente</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/livres"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-slate-700">Ajouter un livre</span>
            </Link>
            
            <Link
              to="/admin/actualites"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-slate-700">Nouvelle actualité</span>
            </Link>
            
            <Link
              to="/admin/messages"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-green-600" />
              <span className="font-medium text-slate-700">Voir messages</span>
            </Link>
            
            <Link
              to="/admin/profil"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Settings className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-slate-700">Paramètres</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
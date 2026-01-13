import { useEffect, useState } from 'react';
import { BookOpen, ShoppingCart, MessageSquare, Users } from 'lucide-react';
import { adminAPI } from '../../lib/api';
import { Dashboard as DashboardType } from '../../types';

interface DashboardProps {
  token: string;
}

export function Dashboard({ token }: DashboardProps) {
  const [data, setData] = useState<DashboardType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI('dashboard', 'GET', undefined, token)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          label="Livres"
          value={data?.nombre_livres || 0}
          color="blue"
        />
        <StatCard
          icon={ShoppingCart}
          label="Ventes"
          value={data?.nombre_ventes || 0}
          color="green"
        />
        <StatCard
          icon={MessageSquare}
          label="Messages"
          value={data?.nombre_messages || 0}
          color="orange"
        />
        <StatCard
          icon={Users}
          label="En ligne"
          value={data?.nombre_connecte || 0}
          color="purple"
        />
      </div>

      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble</h2>
        <p className="text-gray-600">Bienvenue sur votre tableau de bord d'administration.</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: any) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

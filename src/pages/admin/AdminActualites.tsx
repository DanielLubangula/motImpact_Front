import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { adminAPI } from '../../lib/api';

interface AdminActualitesProps {
  token: string;
}

interface Actu {
  _id: string;
  titre: string;
  contenu: string;
  image: string;
  created_at: string;
  updated_at?: string;
}

export function AdminActualites({ token }: AdminActualitesProps) {
  const [actus, setActus] = useState<Actu[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActu, setEditingActu] = useState<Actu | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    titre: '',
    contenu: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchActus();
  }, [token]);

  const fetchActus = async () => {
    try {
      const response = await adminAPI('actus', 'GET', undefined, token);
      setActus(response.data.actus);
    } catch (error) {
      console.error('Erreur chargement actualités:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titre', formData.titre);
      formDataToSend.append('contenu', formData.contenu);

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const url = editingActu ? `actus/${editingActu._id}` : 'actus';
      const method = editingActu ? 'PUT' : 'POST';

      await fetch(`http://localhost:5000/api/admin/${url}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      setMessage({ type: 'success', text: editingActu ? 'Actualité modifiée avec succès' : 'Actualité créée avec succès' });
      resetForm();
      fetchActus();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) return;

    try {
      await adminAPI(`actus/${id}`, 'DELETE', undefined, token);
      setMessage({ type: 'success', text: 'Actualité supprimée avec succès' });
      fetchActus();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      contenu: ''
    });
    setImageFile(null);
    setShowForm(false);
    setEditingActu(null);
  };

  const startEdit = (actu: Actu) => {
    setFormData({
      titre: actu.titre,
      contenu: actu.contenu
    });
    setEditingActu(actu);
    setShowForm(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !showForm) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement des actualités...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={resetForm}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            <h1 className="text-2xl font-bold text-slate-900">
              {editingActu ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
            </h1>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                placeholder="Titre de l'actualité"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Image (optionnelle)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                />
                <ImageIcon className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Si aucune image n'est fournie, une image par défaut sera utilisée.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contenu *
              </label>
              <textarea
                value={formData.contenu}
                onChange={(e) => setFormData(prev => ({ ...prev, contenu: e.target.value }))}
                required
                rows={12}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                placeholder="Rédigez le contenu de votre actualité..."
              />
              <p className="text-xs text-slate-500 mt-1">
                Vous pouvez utiliser des paragraphes en sautant des lignes.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Sauvegarde...' : (editingActu ? 'Modifier' : 'Publier')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Gestion des actualités</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouvelle actualité
          </button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {actus.map((actu) => (
            <div key={actu._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-48 h-48 md:h-auto">
                  <img
                    src={actu.image || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop'}
                    alt={actu.titre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{actu.titre}</h3>
                      <p className="text-sm text-slate-500">
                        Publié le {formatDate(actu.created_at)}
                        {actu.updated_at && actu.updated_at !== actu.created_at && (
                          <span> • Modifié le {formatDate(actu.updated_at)}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(actu)}
                        className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                      >
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(actu._id)}
                        className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-600 line-clamp-3">
                    {actu.contenu.length > 200 ? `${actu.contenu.substring(0, 200)}...` : actu.contenu}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {actus.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucune actualité</h3>
            <p className="text-slate-600 mb-4">Commencez par publier votre première actualité.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Nouvelle actualité
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
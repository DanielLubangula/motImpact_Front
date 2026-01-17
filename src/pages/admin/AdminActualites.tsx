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
import { capitalizeFirst, capitalizeSentences } from '../../lib/textUtils';

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
  const [showDetail, setShowDetail] = useState(false);
  const [selectedActu, setSelectedActu] = useState<Actu | null>(null);
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

      await fetch(`https://motimpact-back.onrender.com/api/admin/${url}`, {
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
    location.reload();
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
    location.reload();
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

  const showActuDetail = (actu: Actu) => {
    setSelectedActu(actu);
    setShowDetail(true);
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

  if (showDetail && selectedActu) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <button
              onClick={() => setShowDetail(false)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base">Retour aux actualités</span>
            </button>
          </div>

          <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="w-full h-48 sm:h-64 lg:h-80">
              <img
                src={selectedActu.image || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop'}
                alt={selectedActu.titre}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 break-words">
                  {selectedActu.titre}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
                  <span>Publié le {formatDate(selectedActu.created_at)}</span>
                  {selectedActu.updated_at && selectedActu.updated_at !== selectedActu.created_at && (
                    <span className="hidden sm:inline">•</span>
                  )}
                  {selectedActu.updated_at && selectedActu.updated_at !== selectedActu.created_at && (
                    <span>Modifié le {formatDate(selectedActu.updated_at)}</span>
                  )}
                </div>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <div className="text-sm sm:text-base lg:text-lg text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                  {selectedActu.contenu}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
                <button
                  onClick={() => {
                    setShowDetail(false);
                    startEdit(selectedActu);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 hover:border-blue-300 text-sm sm:text-base"
                >
                  <Edit className="w-4 h-4" />
                  Modifier cette actualité
                </button>
                <button
                  onClick={() => {
                    setShowDetail(false);
                    handleDelete(selectedActu._id);
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300 text-sm sm:text-base"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer cette actualité
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-8">
            <button
              onClick={resetForm}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base">Retour</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
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

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => setFormData(prev => ({ ...prev, titre: capitalizeFirst(e.target.value) }))}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base"
                placeholder="Titre de l'actualité"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Image (optionnelle)
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base file:mr-2 sm:file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
                <ImageIcon className="w-6 h-6 text-slate-400 flex-shrink-0 self-center sm:self-auto" />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Si aucune image n'est fournie, une image par défaut sera utilisée.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Contenu *
              </label>
              <textarea
                value={formData.contenu}
                onChange={(e) => setFormData(prev => ({ ...prev, contenu: capitalizeSentences(e.target.value) }))}
                required
                rows={8}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base resize-none"
                placeholder="Rédigez le contenu de votre actualité..."
              />
              <p className="text-xs text-slate-500 mt-2">
                Vous pouvez utiliser des paragraphes en sautant des lignes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium"
              >
                {loading ? 'Sauvegarde...' : (editingActu ? 'Modifier' : 'Publier')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base font-medium"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 w-fit"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm sm:text-base">Dashboard</span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Gestion des actualités</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm sm:text-base">Nouvelle actualité</span>
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

        <div className="space-y-4 sm:space-y-6">
          {actus.map((actu) => (
            <div key={actu._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                  <img
                    src={actu.image || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=200&fit=crop'}
                    alt={actu.titre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 sm:p-6 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 break-words">{actu.titre}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 break-words">
                        Publié le {formatDate(actu.created_at)}
                        {actu.updated_at && actu.updated_at !== actu.created_at && (
                          <span className="block sm:inline"> • Modifié le {formatDate(actu.updated_at)}</span>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-row sm:flex-col lg:flex-row gap-2 flex-shrink-0">
                      <button
                        onClick={() => showActuDetail(actu)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Voir</span>
                      </button>
                      <button
                        onClick={() => startEdit(actu)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Modifier</span>
                      </button>
                      <button
                        onClick={() => handleDelete(actu._id)}
                        className="flex items-center justify-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs sm:text-sm flex-1 sm:flex-none"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Supprimer</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-slate-600 text-sm sm:text-base line-clamp-3 break-words flex-1">
                      {actu.contenu.length > 150 ? `${actu.contenu.substring(0, 150)}...` : actu.contenu}
                    </p>
                    {actu.contenu.length > 150 && (
                      <button
                        onClick={() => showActuDetail(actu)}
                        className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ml-2"
                      >
                        Lire plus
                      </button>
                    )}
                  </div>
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
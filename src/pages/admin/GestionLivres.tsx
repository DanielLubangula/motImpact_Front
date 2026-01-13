import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { adminAPI, publicAPI } from '../../lib/api';
import { Livre } from '../../types';

interface GestionLivresProps {
  token: string;
}

export function GestionLivres({ token }: GestionLivresProps) {
  const [livres, setLivres] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    extrait: '',
    statut: 'gratuit' as 'gratuit' | 'payant',
    prix: 0,
    fichier_pdf: '',
    lien_telechargement: '',
    couverture: '',
  });

  useEffect(() => {
    loadLivres();
  }, []);

  const loadLivres = async () => {
    try {
      const response = await publicAPI('livres');
      setLivres(response);
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'prix' ? parseFloat(value) || 0 : value,
    }));
    
    // Si on change le statut, réinitialiser les champs appropriés
    if (name === 'statut') {
      if (value === 'payant') {
        setFormData(prev => ({ ...prev, fichier_pdf: '' }));
      } else {
        setFormData(prev => ({ ...prev, lien_telechargement: '', prix: 0 }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI(`livres/${editingId}`, 'PUT', formData, token);
      } else {
        await adminAPI('livres', 'POST', formData, token);
      }
      await loadLivres();
      setShowForm(false);
      setEditingId(null);
      setFormData({
        titre: '',
        description: '',
        extrait: '',
        statut: 'gratuit',
        prix: 0,
        fichier_pdf: '',
        lien_telechargement: '',
        couverture: '',
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try {
        await adminAPI(`livres/${id}`, 'DELETE', undefined, token);
        await loadLivres();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleEdit = (livre: Livre) => {
    setFormData({
      titre: livre.titre,
      description: livre.description_complete,
      extrait: livre.extrait,
      statut: livre.statut,
      prix: livre.prix,
      fichier_pdf: livre.fichier_pdf,
      lien_telechargement: livre.lien_telechargement || '',
      couverture: livre.couverture,
    });
    setEditingId(livre.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des livres</h1>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              titre: '',
              description: '',
              extrait: '',
              statut: 'gratuit',
              prix: 0,
              fichier_pdf: '',
              lien_telechargement: '',
              couverture: '',
            });
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Ajouter un livre
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Modifier le livre' : 'Ajouter un livre'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Titre</label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Extrait</label>
                <textarea
                  name="extrait"
                  value={formData.extrait}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Statut *
                  </label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white"
                  >
                    <option value="gratuit">📖 Gratuit</option>
                    <option value="payant">💰 Payant (Maketou)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.statut === 'payant' 
                      ? 'Le livre sera vendu via Maketou' 
                      : 'Le livre sera téléchargeable gratuitement'
                    }
                  </p>
                </div>
                
                {formData.statut === 'payant' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Prix (€) *
                    </label>
                    <input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      required={formData.statut === 'payant'}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Ex: 9.99"
                    />
                  </div>
                )}
              </div>

              {/* Gestion des fichiers selon le statut */}
              {formData.statut === 'gratuit' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    📄 Fichier PDF (Livre gratuit)
                  </label>
                  <input
                    type="url"
                    name="fichier_pdf"
                    value={formData.fichier_pdf}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="https://exemple.com/mon-livre.pdf"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    URL directe vers le fichier PDF pour téléchargement gratuit
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    🔗 Lien de téléchargement Maketou *
                  </label>
                  <input
                    type="url"
                    name="lien_telechargement"
                    value={formData.lien_telechargement}
                    onChange={handleChange}
                    required={formData.statut === 'payant'}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="https://maketou.com/produit/mon-livre"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lien vers la page de vente sur Maketou
                  </p>
                  
                  {/* Champ PDF désactivé pour les livres payants */}
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-400 mb-2">
                      📄 Fichier PDF (Géré par Maketou)
                    </label>
                    <input
                      type="text"
                      value="Fichier géré automatiquement par Maketou"
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Le fichier PDF sera fourni automatiquement par Maketou après achat
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  🎨 Image de couverture
                </label>
                <input
                  type="url"
                  name="couverture"
                  value={formData.couverture}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="https://exemple.com/couverture.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL de l'image de couverture (JPG, PNG, WebP)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {editingId ? '✨ Mettre à jour' : '📚 Créer le livre'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Livre</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Prix</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {livres.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium mb-1">Aucun livre pour le moment</p>
                        <p className="text-gray-500 text-sm">Commencez par ajouter votre premier livre</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowForm(true);
                          setEditingId(null);
                          setFormData({
                            titre: '',
                            description: '',
                            extrait: '',
                            statut: 'gratuit',
                            prix: 0,
                            fichier_pdf: '',
                            lien_telechargement: '',
                            couverture: '',
                          });
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter un livre
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                livres.map((livre) => (
                  <tr key={livre.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {livre.couverture && (
                          <img 
                            src={livre.couverture} 
                            alt={livre.titre}
                            className="w-12 h-16 object-cover rounded border border-gray-200"
                          />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">{livre.titre}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Créé le {new Date(livre.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                          livre.statut === 'gratuit'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {livre.statut === 'gratuit' ? '📖' : '💰'}
                        {livre.statut === 'gratuit' ? 'Gratuit' : 'Payant'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {livre.statut === 'payant' ? (
                        <span className="font-semibold text-green-600">{livre.prix}€</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {livre.statut === 'payant' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                          🔗 Maketou
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                          📄 Direct
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(livre)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(livre.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

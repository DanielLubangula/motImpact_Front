import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Upload,
  Star,
  DollarSign,
  Gift,
  ArrowLeft,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { adminAPI } from '../../lib/api';

interface AdminLivresProps {
  token: string;
}

interface Book {
  _id: string;
  titre: string;
  description: string;
  extrait: string;
  statut: 'gratuit' | 'payant';
  prix: number;
  is_featured: boolean;
  couverture: string;
  fichier_pdf: string;
  created_at: string;
}

export function AdminLivres({ token }: AdminLivresProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    extrait: '',
    statut: 'gratuit' as 'gratuit' | 'payant',
    prix: 0,
    is_featured: false
  });

  const [files, setFiles] = useState<{
    couverture: File | null;
    fichier_pdf: File | null;
  }>({
    couverture: null,
    fichier_pdf: null
  });

  useEffect(() => {
    fetchBooks();
  }, [token]);

  const fetchBooks = async () => {
    try {
      const response = await adminAPI('livres', 'GET', undefined, token);
      setBooks(response.data.books);
    } catch (error) {
      console.error('Erreur chargement livres:', error);
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
      formDataToSend.append('description', formData.description);
      formDataToSend.append('extrait', formData.extrait);
      formDataToSend.append('statut', formData.statut);
      formDataToSend.append('prix', formData.prix.toString());
      formDataToSend.append('is_featured', formData.is_featured.toString());

      if (files.couverture) {
        formDataToSend.append('couverture', files.couverture);
      }
      if (files.fichier_pdf) {
        formDataToSend.append('fichier_pdf', files.fichier_pdf);
      }

      const url = editingBook ? `livres/${editingBook._id}` : 'livres';
      const method = editingBook ? 'PUT' : 'POST';

      console.log('Envoi vers:', `http://localhost:5000/api/admin/${url}`);
      console.log('Méthode:', method);
      console.log('Token présent:', !!token);

      const response = await fetch(`http://localhost:5000/api/admin/${url}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      console.log('Réponse reçue:', response.status, response.statusText);

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la sauvegarde';
        try {
          const errorData = await response.json();
          console.log('Erreur détaillée:', errorData);
          errorMessage = errorData.message || errorData.errors?.[0]?.msg || errorMessage;
        } catch {
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Succès:', result);

      setMessage({ type: 'success', text: editingBook ? 'Livre modifié avec succès' : 'Livre créé avec succès' });
      resetForm();
      fetchBooks();
    } catch (error: any) {
      console.error('Erreur complète:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;

    try {
      await adminAPI(`livres/${id}`, 'DELETE', undefined, token);
      setMessage({ type: 'success', text: 'Livre supprimé avec succès' });
      fetchBooks();
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      extrait: '',
      statut: 'gratuit',
      prix: 0,
      is_featured: false
    });
    setFiles({ couverture: null, fichier_pdf: null });
    setShowForm(false);
    setEditingBook(null);
  };

  const startEdit = (book: Book) => {
    setFormData({
      titre: book.titre,
      description: book.description,
      extrait: book.extrait,
      statut: book.statut,
      prix: book.prix,
      is_featured: book.is_featured
    });
    setEditingBook(book);
    setShowForm(true);
  };

  if (loading && !showForm) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement des livres...</p>
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
              {editingBook ? 'Modifier le livre' : 'Nouveau livre'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Statut *
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as 'gratuit' | 'payant' }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                >
                  <option value="gratuit">Gratuit</option>
                  <option value="payant">Payant</option>
                </select>
              </div>
            </div>

            {formData.statut === 'payant' && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Prix (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.prix}
                  onChange={(e) => setFormData(prev => ({ ...prev, prix: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <span className="text-sm font-semibold text-slate-700">Livre mis en avant</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Extrait
              </label>
              <textarea
                value={formData.extrait}
                onChange={(e) => setFormData(prev => ({ ...prev, extrait: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Couverture {!editingBook && '*'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFiles(prev => ({ ...prev, couverture: e.target.files?.[0] || null }))}
                  required={!editingBook}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fichier PDF {!editingBook && '*'}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFiles(prev => ({ ...prev, fichier_pdf: e.target.files?.[0] || null }))}
                  required={!editingBook}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {files.couverture || files.fichier_pdf ? 'Upload en cours...' : 'Sauvegarde...'}
                  </>
                ) : (
                  editingBook ? 'Modifier' : 'Créer'
                )}
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
            <h1 className="text-2xl font-bold text-slate-900">Gestion des livres</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nouveau livre
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="aspect-[3/4] relative">
                <img
                  src={book.couverture || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop'}
                  alt={book.titre}
                  className="w-full h-full object-cover"
                />
                {book.is_featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Mis en avant
                  </div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                  book.statut === 'gratuit' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-amber-500 text-white'
                }`}>
                  {book.statut === 'gratuit' ? (
                    <>
                      <Gift className="w-3 h-3" />
                      Gratuit
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-3 h-3" />
                      {book.prix}€
                    </>
                  )}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{book.titre}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{book.description}</p>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(book)}
                    className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(book._id)}
                    className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun livre</h3>
            <p className="text-slate-600 mb-4">Commencez par ajouter votre premier livre.</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Ajouter un livre
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
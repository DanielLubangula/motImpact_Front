
// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   BookOpen, 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Eye, 
//   Upload,
//   Star,
//   DollarSign,
//   Gift,
//   ArrowLeft,
//   AlertCircle,
//   CheckCircle
// } from 'lucide-react';
// import { adminAPI } from '../../lib/api';
// import { capitalizeFirst, capitalizeSentences } from '../../lib/textUtils';

// interface AdminLivresProps {
//   token: string;
// }

// interface Book {
//   _id: string;
//   titre: string;
//   description: string;
//   extrait: string;
//   statut: 'gratuit' | 'payant';
//   prix: number;
//   is_featured: boolean;
//   couverture: string;
//   fichier_pdf: string;
//   lien_telechargement?: string;
//   created_at: string;
// }

// export function AdminLivres({ token }: AdminLivresProps) {
//   const [books, setBooks] = useState<Book[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingBook, setEditingBook] = useState<Book | null>(null);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

//   const [formData, setFormData] = useState({
//     titre: '',
//     description: '',
//     extrait: '',
//     statut: 'gratuit' as 'gratuit' | 'payant',
//     prix: 0,
//     is_featured: false,
//     lien_telechargement: ''
//   });

//   const [files, setFiles] = useState<{
//     couverture: File | null;
//     fichier_pdf: File | null;
//   }>({
//     couverture: null,
//     fichier_pdf: null
//   });

//   useEffect(() => {
//     if (token) {
//       fetchBooks();
//     }
//   }, [token]);

//   const fetchBooks = async () => {
//     try {
//       const response = await adminAPI('livres', 'GET', undefined, token);
//       const booksData = response.data.books || [];
//       setBooks(booksData);

//       if (typeof response.data.total_books === 'number' && response.data.total_books !== booksData.length) {
//         setMessage({ type: 'error', text: `Incohérence : ${response.data.total_books} livres attendus, mais ${booksData.length} renvoyés.` });
//       }
//     } catch (error) {
//       console.error('Erreur chargement livres:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('titre', formData.titre);
//       formDataToSend.append('description', formData.description);
//       formDataToSend.append('extrait', formData.extrait);
//       formDataToSend.append('statut', formData.statut);
//       formDataToSend.append('prix', formData.prix.toString());
//       formDataToSend.append('is_featured', formData.is_featured.toString());
//       if (formData.lien_telechargement) {
//         formDataToSend.append('lien_telechargement', formData.lien_telechargement);
//       }

//       if (files.couverture) {
//         formDataToSend.append('couverture', files.couverture);
//       }
//       if (files.fichier_pdf) {
//         formDataToSend.append('fichier_pdf', files.fichier_pdf);
//       }

//       const url = editingBook ? `livres/${editingBook._id}` : 'livres';
//       const method = editingBook ? 'PUT' : 'POST';

//       // console.log('Envoi vers:', `https://motimpact-back.onrender.com/api/admin/${url}`);
//       console.log('Méthode:', method);
//       console.log('Token présent:', !!token);

//       const response = await fetch(`https://motimpact-back.onrender.com/api/admin/${url}`, {
//         method,
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formDataToSend
//       });

//       console.log('Réponse reçue:', response.status, response.statusText);

//       if (!response.ok) {
//         let errorMessage = 'Erreur lors de la sauvegarde';
//         try {
//           const errorData = await response.json();
//           console.log('Erreur détaillée:', errorData);
//           errorMessage = errorData.message || errorData.errors?.[0]?.msg || errorMessage;
//         } catch {
//           errorMessage = `Erreur ${response.status}: ${response.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }

//       const result = await response.json();
//       console.log('Succès:', result);

//       setMessage({ type: 'success', text: editingBook ? 'Livre modifié avec succès' : 'Livre créé avec succès' });
//       resetForm();
//       fetchBooks();
//     } catch (error: any) {
//       console.error('Erreur complète:', error);
//       setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde' });
//     } finally {
//       setLoading(false);
//     }

//     location.reload();
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;

//     try {
//       await adminAPI(`livres/${id}`, 'DELETE', undefined, token);
//       setMessage({ type: 'success', text: 'Livre supprimé avec succès' });
//       fetchBooks();
//     } catch (error) {
//       setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       titre: '',
//       description: '',
//       extrait: '',
//       statut: 'gratuit',
//       prix: 0,
//       is_featured: false,
//       lien_telechargement: ''
//     });
//     setFiles({ couverture: null, fichier_pdf: null });
//     setShowForm(false);
//     setEditingBook(null);
//   };

//   const startEdit = (book: Book) => {
//     setFormData({
//       titre: book.titre,
//       description: book.description,
//       extrait: book.extrait,
//       statut: book.statut,
//       prix: book.prix || 0, // Assure que prix est toujours un nombre
//       is_featured: book.is_featured,
//       lien_telechargement: book.lien_telechargement || ''
//     });
//     setEditingBook(book);
//     setShowForm(true);
//   };

//   if (loading && !showForm) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600 mx-auto mb-4"></div>
//           <p className="text-slate-600 text-lg">Chargement des livres...</p>
//         </div>
//       </div>
//     );
//   }

//   if (showForm) {
//     return (
//       <div className="min-h-screen bg-slate-50">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-8">
//             <button
//               onClick={resetForm}
//               className="flex items-center gap-2 text-slate-600 hover:text-slate-900 w-fit"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span className="text-sm sm:text-base">Retour</span>
//             </button>
//             <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
//               {editingBook ? 'Modifier le livre' : 'Nouveau livre'}
//             </h1>
//           </div>

//           {message && (
//             <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
//               message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
//             }`}>
//               {message.type === 'success' ? (
//                 <CheckCircle className="w-5 h-5 text-green-600" />
//               ) : (
//                 <AlertCircle className="w-5 h-5 text-red-600" />
//               )}
//               <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
//                 {message.text}
//               </p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Titre *
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.titre}
//                   onChange={(e) => setFormData(prev => ({ ...prev, titre: capitalizeFirst(e.target.value) }))}
//                   required
//                   className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Statut *
//                 </label>
//                 <select
//                   value={formData.statut}
//                   onChange={(e) => {
//                     const newStatut = e.target.value as 'gratuit' | 'payant';
//                     // Réinitialiser le prix à 0 si on passe de payant à gratuit
//                     if (newStatut === 'gratuit') {
//                       setFormData(prev => ({ ...prev, statut: newStatut, prix: 0 }));
//                     } else {
//                       setFormData(prev => ({ ...prev, statut: newStatut }));
//                     }
//                   }}
//                   className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base"
//                 >
//                   <option value="gratuit">Gratuit</option>
//                   <option value="payant">Payant</option>
//                 </select>
//                 <p className="text-xs text-slate-500 mt-2">Choisissez "Payant" pour fournir un lien Maketou ; "Gratuit" permettra d'uploader la couverture et le PDF.</p>
//               </div>
//             </div>

//             {formData.statut === 'payant' && (
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Prix (€) *
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   value={formData.prix === 0 ? '' : formData.prix} // Afficher vide si 0
//                   onChange={(e) => {
//                     const value = e.target.value;
//                     // Convertir en nombre, ou 0 si vide
//                     const numValue = value === '' ? 0 : parseFloat(value);
//                     setFormData(prev => ({ ...prev, prix: isNaN(numValue) ? 0 : numValue }));
//                   }}
//                   required={formData.statut === 'payant'}
//                   placeholder="0.00"
//                   className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base"
//                 />
//                 <p className="text-xs text-slate-500 mt-1">Pour les livres payants, le prix est obligatoire.</p>
//               </div>
//             )}

//             <div>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   checked={formData.is_featured}
//                   onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
//                   className="rounded border-slate-300"
//                 />
//                 <span className="text-sm font-semibold text-slate-700">Livre mis en avant</span>
//               </label>
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">
//                 Description
//               </label>
//               <textarea
//                 value={formData.description}
//                 onChange={(e) => setFormData(prev => ({ ...prev, description: capitalizeSentences(e.target.value) }))}
//                 rows={4}
//                 className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base resize-none"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">
//                 Extrait
//               </label>
//               <textarea
//                 value={formData.extrait}
//                 onChange={(e) => setFormData(prev => ({ ...prev, extrait: capitalizeSentences(e.target.value) }))}
//                 rows={4}
//                 className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base resize-none"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-700 mb-2">
//                 Couverture {!editingBook && '*'}
//               </label>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => setFiles(prev => ({ ...prev, couverture: e.target.files?.[0] || null }))}
//                 required={!editingBook}
//                 className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
//               />
//               {editingBook && (
//                 <p className="text-xs text-slate-500 mt-1">
//                   Laissez vide pour conserver l'image actuelle.
//                 </p>
//               )}
//             </div>
            
//             {formData.statut === 'gratuit' ? (
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Fichier PDF {!editingBook && '*'}
//                 </label>
//                 <input
//                   type="file"
//                   accept=".pdf"
//                   onChange={(e) => setFiles(prev => ({ ...prev, fichier_pdf: e.target.files?.[0] || null }))}
//                   required={!editingBook && formData.statut === 'gratuit'}
//                   className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
//                 />
//                 {editingBook && (
//                   <p className="text-xs text-slate-500 mt-1">
//                     Laissez vide pour conserver le PDF actuel.
//                   </p>
//                 )}
//               </div>
//             ) : (
//               <div>
//                 <label className="block text-sm font-semibold text-slate-700 mb-2">
//                   Lien de téléchargement (Maketou) {!editingBook && '*'}
//                 </label>
//                 <input
//                   type="url"
//                   value={formData.lien_telechargement}
//                   onChange={(e) => setFormData(prev => ({ ...prev, lien_telechargement: e.target.value }))}
//                   required={!editingBook && formData.statut === 'payant'}
//                   placeholder="https://maketou.example.com/checkout/12345"
//                   className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base"
//                 />
//                 <p className="text-xs text-slate-500 mt-1">Pour les livres payants, fournissez le lien Maketou vers le fichier.</p>
//               </div>
//             )}

//             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     <span className="text-sm sm:text-base">Sauvegarde...</span>
//                   </>
//                 ) : (
//                   <span className="text-sm sm:text-base">{editingBook ? 'Modifier' : 'Créer'}</span>
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="flex-1 sm:flex-none px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
//               >
//                 Annuler
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
//             <Link
//               to="/admin/dashboard"
//               className="flex items-center gap-2 text-slate-600 hover:text-slate-900 w-fit"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span className="text-sm sm:text-base">Dashboard</span>
//             </Link>
//             <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Gestion des livres</h1>
//           </div>
//           <button
//             onClick={() => setShowForm(true)}
//             className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors w-full sm:w-auto"
//           >
//             <Plus className="w-5 h-5" />
//             <span className="text-sm sm:text-base">Nouveau livre</span>
//           </button>
//         </div>

//         {message && (
//           <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
//             message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
//           }`}>
//             {message.type === 'success' ? (
//               <CheckCircle className="w-5 h-5 text-green-600" />
//             ) : (
//               <AlertCircle className="w-5 h-5 text-red-600" />
//             )}
//             <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
//               {message.text}
//             </p>
//           </div>
//         )}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {books.map((book) => (
//             <div key={book._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//               <div className="aspect-[3/4] relative">
//                 <img
//                   src={book.couverture || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop'}
//                   alt={book.titre}
//                   className="w-full h-full object-cover"
//                 />
//                 {book.is_featured && (
//                   <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
//                     <Star className="w-3 h-3 fill-current" />
//                     Mis en avant
//                   </div>
//                 )}
//                 <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
//                   book.statut === 'gratuit' 
//                     ? 'bg-green-500 text-white' 
//                     : 'bg-amber-500 text-white'
//                 }`}>
//                   {book.statut === 'gratuit' ? (
//                     <>
//                       <Gift className="w-3 h-3" />
//                       Gratuit
//                     </>
//                   ) : (
//                     <>
//                       <DollarSign className="w-3 h-3" />
//                       {book.prix}€
//                     </>
//                   )}
//                 </div>
//               </div>
              
//               <div className="p-4">
//                 <h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{book.titre}</h3>
//                 <p className="text-slate-600 text-sm mb-4 line-clamp-3">{book.description}</p>
                
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => startEdit(book)}
//                     className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
//                   >
//                     <Edit className="w-4 h-4" />
//                     Modifier
//                   </button>
//                   <button
//                     onClick={() => handleDelete(book._id)}
//                     className="flex items-center gap-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                     Supprimer
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {books.length === 0 && (
//           <div className="text-center py-12">
//             <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
//             <h3 className="text-lg font-semibold text-slate-900 mb-2">Aucun livre</h3>
//             <p className="text-slate-600 mb-4">Commencez par ajouter votre premier livre.</p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
//             >
//               Ajouter un livre
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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
  CheckCircle,
  Coins  // NOUVEAU: Icône pour la devise
} from 'lucide-react';
import { adminAPI } from '../../lib/api';
import { capitalizeFirst, capitalizeSentences } from '../../lib/textUtils';

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
  devise: 'CDF' | 'USD';  // NOUVEAU: Champ devise
  is_featured: boolean;
  couverture: string;
  fichier_pdf: string;
  lien_telechargement?: string;
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
    devise: 'CDF' as 'CDF' | 'USD',  // NOUVEAU: Champ devise dans le formulaire
    is_featured: false,
    lien_telechargement: ''
  });

  const [files, setFiles] = useState<{
    couverture: File | null;
    fichier_pdf: File | null;
  }>({
    couverture: null,
    fichier_pdf: null
  });

  useEffect(() => {
    if (token) {
      fetchBooks();
    }
  }, [token]);

  const fetchBooks = async () => {
    try {
      const response = await adminAPI('livres', 'GET', undefined, token);
      const booksData = response.data.books || [];
      setBooks(booksData);

      if (typeof response.data.total_books === 'number' && response.data.total_books !== booksData.length) {
        setMessage({ type: 'error', text: `Incohérence : ${response.data.total_books} livres attendus, mais ${booksData.length} renvoyés.` });
      }
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
      formDataToSend.append('devise', formData.devise);  // NOUVEAU: Envoi de la devise
      formDataToSend.append('is_featured', formData.is_featured.toString());
      if (formData.lien_telechargement) {
        formDataToSend.append('lien_telechargement', formData.lien_telechargement);
      }

      if (files.couverture) {
        formDataToSend.append('couverture', files.couverture);
      }
      if (files.fichier_pdf) {
        formDataToSend.append('fichier_pdf', files.fichier_pdf);
      }

      const url = editingBook ? `livres/${editingBook._id}` : 'livres';
      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(`https://motimpact-back.onrender.com/api/admin/${url}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (!response.ok) {
        let errorMessage = 'Erreur lors de la sauvegarde';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.errors?.[0]?.msg || errorMessage;
        } catch {
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();

      setMessage({ type: 'success', text: editingBook ? 'Livre modifié avec succès' : 'Livre créé avec succès' });
      resetForm();
      fetchBooks();
    } catch (error: any) {
      console.error('Erreur complète:', error);
      setMessage({ type: 'error', text: error.message || 'Erreur lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }

    location.reload();
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
      devise: 'CDF',  // NOUVEAU: Reset devise
      is_featured: false,
      lien_telechargement: ''
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
      prix: book.prix || 0,
      devise: book.devise || 'CDF',  // NOUVEAU: Récupération devise
      is_featured: book.is_featured,
      lien_telechargement: book.lien_telechargement || ''
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

          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Statut *
                </label>
                <select
                  value={formData.statut}
                  onChange={(e) => {
                    const newStatut = e.target.value as 'gratuit' | 'payant';
                    if (newStatut === 'gratuit') {
                      setFormData(prev => ({ ...prev, statut: newStatut, prix: 0 }));
                    } else {
                      setFormData(prev => ({ ...prev, statut: newStatut }));
                    }
                  }}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base"
                >
                  <option value="gratuit">Gratuit</option>
                  <option value="payant">Payant</option>
                </select>
                <p className="text-xs text-slate-500 mt-2">Choisissez "Payant" pour fournir un lien Maketou ; "Gratuit" permettra d'uploader la couverture et le PDF.</p>
              </div>
            </div>

            {/* NOUVEAU: Section Devise et Prix - Design responsive */}
            {formData.statut === 'payant' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4" />
                      Devise *
                    </div>
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, devise: 'CDF' }))}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                        formData.devise === 'CDF'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      CDF
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, devise: 'USD' }))}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                        formData.devise === 'USD'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      USD
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Prix ({formData.devise}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.prix === 0 ? '' : formData.prix}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = value === '' ? 0 : parseFloat(value);
                      setFormData(prev => ({ ...prev, prix: isNaN(numValue) ? 0 : numValue }));
                    }}
                    required={formData.statut === 'payant'}
                    placeholder={formData.devise === 'CDF' ? "0" : "0.00"}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {formData.devise === 'CDF' ? 'Prix en Francs Congolais' : 'Prix en Dollars Américains'}
                  </p>
                </div>
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
                onChange={(e) => setFormData(prev => ({ ...prev, description: capitalizeSentences(e.target.value) }))}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Extrait
              </label>
              <textarea
                value={formData.extrait}
                onChange={(e) => setFormData(prev => ({ ...prev, extrait: capitalizeSentences(e.target.value) }))}
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Couverture {!editingBook && '*'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFiles(prev => ({ ...prev, couverture: e.target.files?.[0] || null }))}
                required={!editingBook}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
              />
              {editingBook && (
                <p className="text-xs text-slate-500 mt-1">
                  Laissez vide pour conserver l'image actuelle.
                </p>
              )}
            </div>
            
            {formData.statut === 'gratuit' ? (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fichier PDF {!editingBook && '*'}
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFiles(prev => ({ ...prev, fichier_pdf: e.target.files?.[0] || null }))}
                  required={!editingBook && formData.statut === 'gratuit'}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
                {editingBook && (
                  <p className="text-xs text-slate-500 mt-1">
                    Laissez vide pour conserver le PDF actuel.
                  </p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Lien de téléchargement (Maketou) {!editingBook && '*'}
                </label>
                <input
                  type="url"
                  value={formData.lien_telechargement}
                  onChange={(e) => setFormData(prev => ({ ...prev, lien_telechargement: e.target.value }))}
                  required={!editingBook && formData.statut === 'payant'}
                  placeholder="https://maketou.example.com/checkout/12345"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none text-sm sm:text-base"
                />
                <p className="text-xs text-slate-500 mt-1">Pour les livres payants, fournissez le lien Maketou vers le fichier.</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm sm:text-base">Sauvegarde...</span>
                  </>
                ) : (
                  <span className="text-sm sm:text-base">{editingBook ? 'Modifier' : 'Créer'}</span>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 sm:flex-none px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
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
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Gestion des livres</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm sm:text-base">Nouveau livre</span>
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
                      {/* NOUVEAU: Affichage avec devise */}
                      {book.prix.toLocaleString('fr-FR')} {book.devise}
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
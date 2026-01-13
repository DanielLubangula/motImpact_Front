import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { adminAPI } from '../../lib/api';

interface AdminProfilProps {
  token: string;
}

interface SocialLink {
  network: string;
  url: string;
}

interface AdminProfile {
  _id: string;
  email: string;
  nom: string;
  biographie: string;
  short_biographie: string;
  email_contact: string;
  message_accroche: string;
  photo: string;
  social_links: SocialLink[];
}

export function AdminProfil({ token }: AdminProfilProps) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    nom: '',
    biographie: '',
    short_biographie: '',
    email_contact: '',
    message_accroche: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newSocial, setNewSocial] = useState({ network: '', url: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showPhotoConfirm, setShowPhotoConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPasswordErrorModal, setShowPasswordErrorModal] = useState(false);

  const socialNetworks = [
    'facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'github'
  ];

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await adminAPI('profile', 'GET', null, token);
      if (response && response.status === 'success') {
        const profileData = response.admin;
        setProfile(profileData);
        setFormData({
          nom: profileData.nom || '',
          biographie: profileData.biographie || '',
          short_biographie: profileData.short_biographie || '',
          email_contact: profileData.email_contact || '',
          message_accroche: profileData.message_accroche || '',
          email: profileData.email || ''
        });
        setSocialLinks(profileData.social_links || []);
      }
    } catch (error: any) {
      console.error('Erreur chargement profil:', error);
      // Ne pas afficher d'erreur si c'est un problème de token (la redirection se fait automatiquement)
      if (!error.message?.toLowerCase().includes('token')) {
        setMessage({ type: 'error', text: 'Erreur lors du chargement du profil' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Validation basique
      if (!formData.nom.trim()) {
        setMessage({ type: 'error', text: 'Le nom est requis' });
        setSaving(false);
        return;
      }

      if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setMessage({ type: 'error', text: 'Email valide requis' });
        setSaving(false);
        return;
      }

      // Mot de passe actuel TOUJOURS requis pour toute modification
      if (!passwordData.currentPassword) {
        setMessage({ type: 'error', text: 'Votre mot de passe actuel est requis pour confirmer les modifications' });
        setSaving(false);
        return;
      }

      // Nouveau mot de passe si fourni
      if (passwordData.password) {
        if (passwordData.password.length < 6) {
          setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
          setSaving(false);
          return;
        }
        if (passwordData.password !== passwordData.confirmPassword) {
          setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
          setSaving(false);
          return;
        }
      }

      let dataToSend: any;
      
      // Utiliser FormData si on a une photo
      if (photoFile) {
        const formDataToSend = new FormData();
        
        // Données du profil (seulement les champs non vides)
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value.toString().trim() !== '') {
            formDataToSend.append(key, value.toString().trim());
          }
        });

        if (passwordData.currentPassword) {
          formDataToSend.append('currentPassword', passwordData.currentPassword);
        }

        if (passwordData.password) {
          formDataToSend.append('password', passwordData.password);
        }

        // Réseaux sociaux
        if (socialLinks.length > 0) {
          formDataToSend.append('socials', JSON.stringify(socialLinks));
        }

        // Photo - utiliser 'image' comme attendu par le middleware
        formDataToSend.append('image', photoFile);
        
        dataToSend = formDataToSend;
      } else {
        // Utiliser JSON pour les données simples (nettoyer les champs vides)
        const cleanedData: any = {};
        
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value.toString().trim() !== '') {
            cleanedData[key] = value.toString().trim();
          }
        });

        if (passwordData.currentPassword) {
          cleanedData.currentPassword = passwordData.currentPassword;
        }

        if (passwordData.password) {
          cleanedData.password = passwordData.password;
        }

        if (socialLinks.length > 0) {
          cleanedData.socials = socialLinks;
        }
        
        dataToSend = cleanedData;
      }

      console.log('Données à envoyer:', dataToSend);
      
      const response = await adminAPI('profile', 'PUT', dataToSend, token);
      
      if (response.status === 'success') {
        setMessage({ type: 'success', text: 'Profil mis à jour avec succès' });
        setPasswordData({ currentPassword: '', password: '', confirmPassword: '' });
        setShowPasswordForm(false);
        setPhotoFile(null);
        setPhotoPreview(null);
        
        // Recharger le profil depuis la BD
        await fetchProfile();
        
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Erreur lors de la mise à jour';
      
      // Vérifier si c'est une erreur de mot de passe incorrect
      if (errorMessage.toLowerCase().includes('mot de passe') || 
          errorMessage.toLowerCase().includes('password') ||
          errorMessage.toLowerCase().includes('incorrect') ||
          errorMessage.toLowerCase().includes('invalid')) {
        setShowPasswordErrorModal(true);
      } else {
        setMessage({ type: 'error', text: errorMessage });
      }
    } finally {
      setSaving(false);
    }
  };

  const addSocialLink = () => {
    if (newSocial.network && newSocial.url) {
      // Vérifier si l'URL est valide
      try {
        new URL(newSocial.url);
      } catch {
        setMessage({ type: 'error', text: 'URL invalide pour le réseau social' });
        return;
      }

      const exists = socialLinks.find(link => link.network === newSocial.network);
      if (exists) {
        // Mettre à jour le lien existant
        setSocialLinks(prev => prev.map(link => 
          link.network === newSocial.network ? { ...link, url: newSocial.url } : link
        ));
        setMessage({ type: 'success', text: `Lien ${newSocial.network} mis à jour` });
      } else {
        // Ajouter un nouveau lien
        setSocialLinks(prev => [...prev, { ...newSocial }]);
        setMessage({ type: 'success', text: `Lien ${newSocial.network} ajouté` });
      }
      setNewSocial({ network: '', url: '' });
    } else {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un réseau et saisir une URL' });
    }
  };

  const removeSocialLink = async (network: string) => {
    try {
      // Supprimer localement
      setSocialLinks(prev => prev.filter(link => link.network !== network));
      setMessage({ type: 'success', text: `Lien ${network} supprimé` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Profil administrateur</h1>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section de sécurité - Mot de passe actuel */}
          <div className={`border-2 rounded-xl p-6 ${
            photoFile ? 'bg-orange-50 border-orange-300' : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                photoFile ? 'bg-orange-100' : 'bg-amber-100'
              }`}>
                <Lock className={`w-5 h-5 ${
                  photoFile ? 'text-orange-700' : 'text-amber-700'
                }`} />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${
                  photoFile ? 'text-orange-900' : 'text-amber-900'
                }`}>Sécurité requise</h2>
                <p className={`text-sm ${
                  photoFile ? 'text-orange-700' : 'text-amber-700'
                }`}>
                  {photoFile ? 
                    'Photo sélectionnée - Confirmez votre identité pour sauvegarder' : 
                    'Confirmez votre identité pour sauvegarder les modifications'
                  }
                </p>
              </div>
            </div>
            
            {photoFile && (
              <div className="mb-4 p-3 bg-orange-100 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    Nouvelle photo prête à être sauvegardée
                  </span>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg p-4 border border-amber-200">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-amber-900 mb-2">
                Votre mot de passe actuel *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-600" />
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none"
                  placeholder="Saisissez votre mot de passe actuel"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-amber-600 mt-2">
                🔒 Requis pour toute modification de votre profil par sécurité
              </p>
            </div>
          </div>
          {/* Photo de profil */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Photo de profil</h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                ) : profile?.photo ? (
                  <img src={profile.photo} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setPhotoPreview(e.target?.result as string);
                        setShowPhotoConfirm(true);
                      };
                      reader.readAsDataURL(file);
                      setPhotoFile(file);
                    }
                  }}
                  className="mb-2"
                />
                <p className="text-sm text-slate-600">
                  Formats acceptés : JPG, PNG. Taille max : 5MB
                </p>
                {showPhotoConfirm && (
                  <div className="mt-4 p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <h4 className="font-semibold text-amber-900">Photo sélectionnée</h4>
                    </div>
                    <p className="text-sm text-amber-800 mb-4">
                      📷 Votre nouvelle photo est prête. <strong>N'oubliez pas de saisir votre mot de passe actuel ci-dessus et de cliquer sur "Sauvegarder" en bas de page</strong> pour finaliser le changement.
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowPhotoConfirm(false);
                          setPhotoPreview(null);
                          setPhotoFile(null);
                        }}
                        className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        ❌ Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPhotoConfirm(false)}
                        className="px-3 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        ✓ Continuer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Informations personnelles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email de connexion
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email de contact public
                </label>
                <input
                  type="email"
                  value={formData.email_contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, email_contact: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                  placeholder="contact@motimpact.cd"
                />
              </div>
            </div>
          </div>

          {/* Contenu littéraire */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Contenu littéraire</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Message d'accroche
                </label>
                <input
                  type="text"
                  value={formData.message_accroche}
                  onChange={(e) => setFormData(prev => ({ ...prev, message_accroche: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                  placeholder="Bienvenue dans mon univers littéraire"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Biographie courte
                </label>
                <textarea
                  value={formData.short_biographie}
                  onChange={(e) => setFormData(prev => ({ ...prev, short_biographie: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                  placeholder="Description courte pour la page d'accueil"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Biographie complète
                </label>
                <textarea
                  value={formData.biographie}
                  onChange={(e) => setFormData(prev => ({ ...prev, biographie: e.target.value }))}
                  rows={8}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                  placeholder="Biographie détaillée pour la page biographie"
                />
              </div>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Réseaux sociaux</h2>
            
            {/* Liens existants */}
            <div className="space-y-3 mb-6">
              {socialLinks.map((link) => (
                <div key={link.network} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="capitalize font-medium text-slate-700 w-20">{link.network}</span>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => setSocialLinks(prev => prev.map(l => 
                      l.network === link.network ? { ...l, url: e.target.value } : l
                    ))}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded focus:border-slate-500 focus:outline-none"
                  />
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-slate-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(link.network)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Ajouter un nouveau lien */}
            <div className="flex gap-3">
              <select
                value={newSocial.network}
                onChange={(e) => setNewSocial(prev => ({ ...prev, network: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
              >
                <option value="">Choisir un réseau</option>
                {socialNetworks.filter(network => !socialLinks.find(link => link.network === network)).map(network => (
                  <option key={network} value={network}>{network}</option>
                ))}
              </select>
              <input
                type="url"
                value={newSocial.url}
                onChange={(e) => setNewSocial(prev => ({ ...prev, url: e.target.value }))}
                placeholder="URL du profil"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={addSocialLink}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Changement de mot de passe (optionnel) */}
          {showPasswordForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Changer le mot de passe</h2>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                  }}
                  className="text-slate-600 hover:text-slate-900 text-sm"
                >
                  Annuler
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                      placeholder="Minimum 6 caractères"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
                      placeholder="Confirmez le nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bouton pour afficher le changement de mot de passe */}
          {!showPasswordForm && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">Mot de passe</h3>
                  <p className="text-sm text-slate-600">Dernière modification il y a quelque temps</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Changer le mot de passe
                </button>
              </div>
            </div>
          )}

          {/* Bouton de sauvegarde */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                  {photoFile ? <Camera className="w-5 h-5 text-orange-600" /> : <Save className="w-5 h-5 text-slate-600" />}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {photoFile ? 'Sauvegarder la nouvelle photo' : 'Sauvegarder les modifications'}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {passwordData.currentPassword ? 
                      (photoFile ? 
                        "Photo et mot de passe prêts - Cliquez pour sauvegarder" : 
                        "Mot de passe confirmé - Prêt à sauvegarder"
                      ) : 
                      "Veuillez saisir votre mot de passe actuel ci-dessus"
                    }
                  </p>
                </div>
              </div>
              <button
                type="submit"
                disabled={saving || !passwordData.currentPassword}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  !passwordData.currentPassword 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : saving 
                      ? 'bg-amber-400 text-amber-900 cursor-not-allowed' 
                      : 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-900"></div>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Sauvegarder
                  </>
                )}
              </button>
            </div>
            {!passwordData.currentPassword && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  ⚠️ Pour des raisons de sécurité, votre mot de passe actuel est requis pour sauvegarder toute modification.
                </p>
              </div>
            )}
          </div>
        </form>

        {/* Modal de succès */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full mx-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Mise à jour effectuée avec succès !
              </h3>
              <p className="text-slate-600 mb-6">
                Votre profil a été mis à jour et sauvegardé.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setPhotoPreview(null);
                }}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Modal d'erreur mot de passe */}
        {showPasswordErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                Mot de passe incorrect
              </h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Le mot de passe que vous avez saisi ne correspond pas à votre mot de passe actuel. 
                Veuillez vérifier et réessayer.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setShowPasswordErrorModal(false);
                    setPasswordData(prev => ({ ...prev, currentPassword: '' }));
                  }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                >
                  Réessayer
                </button>
                <button
                  onClick={() => setShowPasswordErrorModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 font-semibold"
                >
                  Annuler
                </button>
              </div>
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs sm:text-sm text-amber-800">
                  📝 <strong>Astuce :</strong> Assurez-vous que la touche Verr Maj n'est pas activée
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useCallback } from 'react';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Feather, Quote, CheckCircle, AlertCircle } from 'lucide-react';
import { publicAPI } from '../lib/api';

interface ContactForm {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

interface ApiError {
  message: string;
  status?: number;
}

export function Contact() {
  const [formData, setFormData] = useState<ContactForm>({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.sujet.trim()) {
      newErrors.sujet = 'Le sujet est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await publicAPI('contact', 'POST', formData);
      
      if (response?.status === 'success') {
        setSubmitStatus('success');
        setFormData({ nom: '', email: '', sujet: '', message: '' });
        setErrors({});
      } else {
        throw new Error(response?.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (error: any) {
      console.error('Erreur envoi message:', error);
      setSubmitStatus('error');
      setErrorMessage(
        error?.message || 
        'Une erreur s\'est produite lors de l\'envoi. Veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 py-6 sm:py-8 md:py-10 border-b-2 border-amber-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
              <Feather className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-amber-700 font-serif mb-1">Échanges littéraires</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-amber-900 leading-tight">
                Correspondance
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Informations de contact */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 space-y-6 sm:space-y-8">
              {/* Message d'accueil */}
              <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-amber-200">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-900">
                    Écrivons ensemble
                  </h2>
                </div>
                <p className="text-sm sm:text-base md:text-lg text-amber-800 font-serif leading-relaxed mb-4 sm:mb-6">
                  J'ai toujours cru que la littérature est un dialogue entre l'auteur et ses lecteurs. 
                  Vos mots, vos réflexions et vos questions nourrissent ma créativité et enrichissent mon univers littéraire.
                </p>
                <p className="text-sm sm:text-base text-amber-700 font-serif leading-relaxed">
                  N'hésitez pas à me faire part de vos impressions sur mes œuvres, vos suggestions, 
                  ou simplement à partager avec moi votre passion pour les mots.
                </p>
              </div>

              {/* Coordonnées */}
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-orange-200">
                <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-amber-900 mb-4 sm:mb-6">
                  Mes coordonnées
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-amber-600 font-serif mb-1">Email</p>
                      <a 
                        href="mailto:contact@motimpact.cd" 
                        className="text-sm sm:text-base font-serif font-semibold text-amber-900 hover:text-amber-700 transition-colors"
                      >
                        contact@motimpact.cd
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-700" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-amber-600 font-serif mb-1">Téléphone</p>
                      <a 
                        href="tel:+243812345678" 
                        className="text-sm sm:text-base font-serif font-semibold text-amber-900 hover:text-amber-700 transition-colors"
                      >
                        +243 (0)81 234 56 78
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-700" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-amber-600 font-serif mb-1">Localisation</p>
                      <p className="text-sm sm:text-base font-serif font-semibold text-amber-900">
                        Kinshasa, République Démocratique du Congo
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Horaires de réponse */}
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-amber-300">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-900 mb-3 sm:mb-4">
                  Temps de réponse
                </h3>
                <p className="text-sm sm:text-base text-amber-800 font-serif leading-relaxed">
                  Je m'efforce de répondre à tous les messages dans un délai de 48 à 72 heures. 
                  Votre patience est appréciée, car chaque réponse est rédigée avec soin.
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-lg border-2 border-amber-200">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-200 to-orange-200 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 sm:w-6 sm:h-6 text-amber-800" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-900">
                  Envoyez-moi un message
                </h2>
              </div>

              {/* Messages de statut */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-800 font-serif text-sm sm:text-base">
                    Votre message a été envoyé avec succès ! Je vous répondrai bientôt.
                  </p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <div className="text-red-800 font-serif text-sm sm:text-base">
                    <p className="font-semibold mb-1">Erreur lors de l'envoi</p>
                    <p>{errorMessage || 'Une erreur s\'est produite. Veuillez réessayer ou me contacter directement par email.'}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Nom */}
                <div>
                  <label htmlFor="nom" className="block text-sm sm:text-base font-serif font-semibold text-amber-900 mb-2">
                    Votre nom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 rounded-lg sm:rounded-xl focus:outline-none font-serif text-sm sm:text-base text-amber-900 placeholder-amber-500 bg-white transition-colors ${
                        errors.nom ? 'border-red-300 focus:border-red-500' : 'border-amber-200 focus:border-amber-500'
                      }`}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  {errors.nom && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 font-serif">{errors.nom}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm sm:text-base font-serif font-semibold text-amber-900 mb-2">
                    Votre email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border-2 rounded-lg sm:rounded-xl focus:outline-none font-serif text-sm sm:text-base text-amber-900 placeholder-amber-500 bg-white transition-colors ${
                        errors.email ? 'border-red-300 focus:border-red-500' : 'border-amber-200 focus:border-amber-500'
                      }`}
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 font-serif">{errors.email}</p>
                  )}
                </div>

                {/* Sujet */}
                <div>
                  <label htmlFor="sujet" className="block text-sm sm:text-base font-serif font-semibold text-amber-900 mb-2">
                    Sujet *
                  </label>
                  <select
                    id="sujet"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 sm:py-4 border-2 rounded-lg sm:rounded-xl focus:outline-none font-serif text-sm sm:text-base text-amber-900 bg-white cursor-pointer transition-colors ${
                      errors.sujet ? 'border-red-300 focus:border-red-500' : 'border-amber-200 focus:border-amber-500'
                    }`}
                  >
                    <option value="">Choisissez un sujet</option>
                    <option value="question-generale">Question générale</option>
                    <option value="commentaire-livre">Commentaire sur un livre</option>
                    <option value="collaboration">Proposition de collaboration</option>
                    <option value="interview">Demande d'interview</option>
                    <option value="invitation">Invitation à un événement</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errors.sujet && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 font-serif">{errors.sujet}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm sm:text-base font-serif font-semibold text-amber-900 mb-2">
                    Votre message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 sm:py-4 border-2 rounded-lg sm:rounded-xl focus:outline-none font-serif text-sm sm:text-base text-amber-900 placeholder-amber-500 bg-white resize-vertical transition-colors ${
                      errors.message ? 'border-red-300 focus:border-red-500' : 'border-amber-200 focus:border-amber-500'
                    }`}
                    placeholder="Partagez vos pensées, questions ou commentaires..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600 font-serif">{errors.message}</p>
                  )}
                  <p className="mt-2 text-xs sm:text-sm text-amber-600 font-serif">
                    Minimum 10 caractères • {formData.message.length} caractères
                  </p>
                </div>

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-lg sm:rounded-xl hover:from-amber-800 hover:to-amber-900 disabled:from-amber-400 disabled:to-amber-500 disabled:cursor-not-allowed transition-all duration-300 font-serif font-semibold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
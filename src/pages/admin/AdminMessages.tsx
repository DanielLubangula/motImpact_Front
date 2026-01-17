import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MailOpen, Trash2, Eye, Calendar, User, MessageSquare, AlertCircle, CheckCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { adminAPI } from '../../lib/api';
import { useNavigate } from 'react-router-dom';


interface Message {
  _id: string;
  nom: string;
  email: string;
  sujet: string;
  contenu: string;
  statut: 'non_lu' | 'lu' | 'repondu';
  created_at: string;
}

interface AdminMessagesProps {
  token: string;
}

interface NotificationState {
  type: 'success' | 'error' | 'info';
  message: string;
  show: boolean;
}

export function AdminMessages({ token }: AdminMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'non_lu' | 'lu' | 'repondu'>('all');
  const [notification, setNotification] = useState<NotificationState>({
    type: 'info',
    message: '',
    show: false
  });

  const showNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  const fetchMessages = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const response = await adminAPI('messages', 'GET', null, token);
      if (response?.status === 'success') {

        setMessages(response.data.messages || []);
        if (showRefreshIndicator) {
          showNotification('success', 'Messages actualisés avec succès');
        }
      } else {
        throw new Error(response?.message || 'Erreur lors du chargement');
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors du chargement des messages';
      setError(errorMsg);
      showNotification('error', errorMsg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, showNotification]);

  const handleMessageClick = useCallback(async (message: Message) => {
    setSelectedMessage(message);
    setShowConversation(true);

    // Marquer comme lu si non lu
    if (message.statut === 'non_lu') {
      try {
        await adminAPI(`messages/${message._id}`, 'GET', null, token);
        setMessages(prev => prev.map(m =>
          m._id === message._id ? { ...m, statut: 'lu' as const } : m
        ));
        showNotification('info', 'Message marqué comme lu');
      } catch (err: any) {
        console.error('Erreur lors du marquage comme lu:', err);
        showNotification('error', 'Erreur lors du marquage comme lu');
      }
    }
  }, [token, showNotification]);

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      await adminAPI(`messages/${messageId}`, 'DELETE', null, token);
      setMessages(prev => prev.filter(m => m._id !== messageId));
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null);
      }
      showNotification('success', 'Message supprimé avec succès');
    } catch (err: any) {
      const errorMsg = err?.message || 'Erreur lors de la suppression';
      setError(errorMsg);
      showNotification('error', errorMsg);
    }
  }, [token, selectedMessage, showNotification]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true;
    return message.statut === filter;
  });

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'non_lu': return 'bg-red-100 text-red-800';
      case 'lu': return 'bg-blue-100 text-blue-800';
      case 'repondu': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'non_lu': return 'Non lu';
      case 'lu': return 'Lu';
      case 'repondu': return 'Répondu';
      default: return statut;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Chargement des messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header fixe */}
      <header className="bg-white shadow-sm border-b border-slate-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-4 py-3 sm:py-4">
            {/* <Link
              to="/admin/dashboard"
              className="flex items-center gap-1 sm:gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link> */}
            <button
              onClick={() => {
                navigate('/admin/dashboard');
                console.log('reload')
                window.location.reload();
              }}
              className="flex items-center gap-1 sm:gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900">Messages reçus</h1>
              <p className="text-xs sm:text-sm text-slate-600 hidden sm:block">Gérez les messages de contact</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pt-16 sm:pt-20 lg:pt-24">

        {/* Notification */}
        {notification.show && (
          <div key="notification" className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg flex items-center gap-2 sm:gap-3 transition-all duration-300 ${notification.type === 'success' ? 'bg-green-50 border border-green-200' :
              notification.type === 'error' ? 'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'
            }`}>
            {notification.type === 'success' && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />}
            {notification.type === 'info' && <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />}
            <p className={`text-sm sm:text-base ${notification.type === 'success' ? 'text-green-800' :
                notification.type === 'error' ? 'text-red-800' :
                  'text-blue-800'
              }`}>
              {notification.message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Liste des messages */}
          <div className={`lg:col-span-1 ${showConversation ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="p-3 sm:p-4 border-b border-slate-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                    Messages ({filteredMessages.length})
                  </h2>
                  <button
                    onClick={() => fetchMessages(true)}
                    disabled={refreshing}
                    className="p-1 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Actualiser"
                  >
                    <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {[
                    { key: 'all', label: 'Tous', count: messages.length },
                    { key: 'non_lu', label: 'Non lus', count: messages.filter(m => m.statut === 'non_lu').length },
                    { key: 'lu', label: 'Lus', count: messages.filter(m => m.statut === 'lu').length },
                    { key: 'repondu', label: 'Répondus', count: messages.filter(m => m.statut === 'repondu').length }
                  ].map(({ key, label, count }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key as any)}
                      className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${filter === key
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      <span className="hidden sm:inline">{label} ({count})</span>
                      <span className="sm:hidden">{label.charAt(0)} ({count})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:max-h-96 lg:overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center">
                    <MessageSquare className="w-8 h-8 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-slate-500 text-sm sm:text-base">Aucun message trouvé</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200">
                    {filteredMessages.map((message) => (
                      <div
                        key={`message-${message._id}`}
                        onClick={() => handleMessageClick(message)}
                        className={`p-3 sm:p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedMessage?._id === message._id ? 'bg-slate-100' : ''
                          }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                            {message.statut === 'non_lu' ? (
                              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                            ) : (
                              <MailOpen className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                            )}
                            <span className="font-medium text-slate-900 truncate text-sm sm:text-base">
                              {message.nom}
                            </span>
                          </div>
                          <span className={`px-1 sm:px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(message.statut)}`}>
                            <span className="hidden sm:inline">{getStatusText(message.statut)}</span>
                            <span className="sm:hidden">{message.statut === 'non_lu' ? '●' : message.statut === 'lu' ? '○' : '✓'}</span>
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 truncate mb-1">{message.sujet}</p>
                        <p className="text-xs text-slate-500">
                          <span className="hidden sm:inline">{formatDate(message.created_at)}</span>
                          <span className="sm:hidden">{new Date(message.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Détail du message */}
          <div className={`lg:col-span-2 ${showConversation ? 'block' : 'hidden lg:block'}`}>
            {selectedMessage ? (
              <div key={`selected-${selectedMessage._id}`} className="bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="p-4 sm:p-6 border-b border-slate-200">
                  <div className="flex items-center gap-3 mb-4 lg:hidden">
                    <button
                      onClick={() => setShowConversation(false)}
                      className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <h2 className="text-lg font-semibold text-slate-900">Conversation</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 break-words">
                        {selectedMessage.sujet}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{selectedMessage.nom}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{selectedMessage.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="hidden sm:inline">{formatDate(selectedMessage.created_at)}</span>
                          <span className="sm:hidden">{new Date(selectedMessage.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(selectedMessage.statut)}`}>
                        <span className="hidden sm:inline">{getStatusText(selectedMessage.statut)}</span>
                        <span className="sm:hidden">{selectedMessage.statut === 'non_lu' ? 'Non lu' : selectedMessage.statut === 'lu' ? 'Lu' : 'Répondu'}</span>
                      </span>
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage._id)}
                        className="p-1 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer le message"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-slate-50 p-3 sm:p-4 rounded-lg border text-sm sm:text-base">
                      {selectedMessage.contenu}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.sujet}`}
                        className="inline-flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm sm:text-base"
                      >
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Répondre par email</span>
                        <span className="sm:hidden">Répondre</span>
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedMessage.email);
                          showNotification('success', 'Email copié dans le presse-papiers');
                        }}
                        className="px-3 sm:px-4 py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm sm:text-base"
                      >
                        <span className="hidden sm:inline">Copier l'email</span>
                        <span className="sm:hidden">Copier</span>
                      </button>
                      <Link
                        to="/admin/dashboard"
                        className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center text-sm sm:text-base"
                      >
                        <span className="hidden sm:inline">Retour au dashboard</span>
                        <span className="sm:hidden">Dashboard</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
                <Eye className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-2">
                  Sélectionnez un message
                </h3>
                <p className="text-slate-600 text-sm sm:text-base">
                  <span className="hidden sm:inline">Cliquez sur un message dans la liste pour voir son contenu</span>
                  <span className="sm:hidden">Cliquez sur un message pour le voir</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
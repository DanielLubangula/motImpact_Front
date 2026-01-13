import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Mail, 
  User, 
  Calendar,
  Eye,
  EyeOff,
  ArrowLeft,
  Filter,
  Search,
  CheckCircle,
  Clock,
  Reply
} from 'lucide-react';
import { adminAPI } from '../../lib/api';

interface AdminMessagesProps {
  token: string;
}

interface Message {
  _id: string;
  nom: string;
  email: string;
  sujet: string;
  contenu: string;
  statut: 'non_lu' | 'lu' | 'repondu';
  created_at: string;
}

export function AdminMessages({ token }: AdminMessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filterStatus, setFilterStatus] = useState<'tous' | 'non_lu' | 'lu' | 'repondu'>('tous');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const fetchMessages = async () => {
    try {
      // Note: L'endpoint messages n'existe pas encore dans le backend
      // Utilisation de données mockées pour l'instant
      const mockMessages: Message[] = [
        {
          _id: '1',
          nom: 'Marie Dubois',
          email: 'marie.dubois@email.com',
          sujet: 'question-generale',
          contenu: 'Bonjour, j\'ai lu votre livre "Les Mots qui Transforment" et j\'ai été profondément touchée par votre style d\'écriture. Pourriez-vous me dire quelles sont vos influences littéraires principales ?',
          statut: 'non_lu',
          created_at: '2024-03-20T10:30:00Z'
        },
        {
          _id: '2',
          nom: 'Jean Mukendi',
          email: 'jean.mukendi@gmail.com',
          sujet: 'collaboration',
          contenu: 'Bonjour Enock, je suis éditeur chez Editions Kinshasa et nous serions intéressés par une collaboration pour publier vos prochaines œuvres. Pourrions-nous organiser une rencontre ?',
          statut: 'lu',
          created_at: '2024-03-18T14:15:00Z'
        },
        {
          _id: '3',
          nom: 'Sophie Laurent',
          email: 'sophie.laurent@univ.cd',
          sujet: 'interview',
          contenu: 'Bonjour, je suis étudiante en littérature à l\'Université de Kinshasa et je prépare un mémoire sur la littérature congolaise contemporaine. Accepteriez-vous de répondre à quelques questions pour mon travail de recherche ?',
          statut: 'repondu',
          created_at: '2024-03-15T09:45:00Z'
        }
      ];
      
      setMessages(mockMessages);
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: 'lu' | 'repondu') => {
    try {
      // Mise à jour locale pour l'instant
      setMessages(prev => prev.map(msg => 
        msg._id === messageId ? { ...msg, statut: newStatus } : msg
      ));
      
      if (selectedMessage && selectedMessage._id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, statut: newStatus } : null);
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.contenu.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'tous' || message.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'non_lu': return 'bg-red-100 text-red-800 border-red-200';
      case 'lu': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'repondu': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'non_lu': return <EyeOff className="w-3 h-3" />;
      case 'lu': return <Eye className="w-3 h-3" />;
      case 'repondu': return <CheckCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getSubjectLabel = (sujet: string) => {
    const subjects: Record<string, string> = {
      'question-generale': 'Question générale',
      'commentaire-livre': 'Commentaire sur un livre',
      'collaboration': 'Proposition de collaboration',
      'interview': 'Demande d\'interview',
      'invitation': 'Invitation à un événement',
      'autre': 'Autre'
    };
    return subjects[sujet] || sujet;
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

  if (selectedMessage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setSelectedMessage(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour aux messages
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Message de {selectedMessage.nom}</h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            {/* Header du message */}
            <div className="border-b border-slate-200 pb-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">{getSubjectLabel(selectedMessage.sujet)}</h2>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {selectedMessage.nom}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedMessage.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedMessage.created_at)}
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(selectedMessage.statut)}`}>
                  {getStatusIcon(selectedMessage.statut)}
                  {selectedMessage.statut === 'non_lu' ? 'Non lu' : 
                   selectedMessage.statut === 'lu' ? 'Lu' : 'Répondu'}
                </div>
              </div>
            </div>

            {/* Contenu du message */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Message :</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.contenu}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              {selectedMessage.statut === 'non_lu' && (
                <button
                  onClick={() => updateMessageStatus(selectedMessage._id, 'lu')}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Marquer comme lu
                </button>
              )}
              
              {selectedMessage.statut !== 'repondu' && (
                <button
                  onClick={() => updateMessageStatus(selectedMessage._id, 'repondu')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Marquer comme répondu
                </button>
              )}

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${getSubjectLabel(selectedMessage.sujet)}`}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Reply className="w-4 h-4" />
                Répondre par email
              </a>
            </div>
          </div>
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
            <h1 className="text-2xl font-bold text-slate-900">Messages reçus</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MessageSquare className="w-4 h-4" />
            {messages.length} message(s)
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher dans les messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="pl-10 pr-8 py-2 border border-slate-300 rounded-lg focus:border-slate-500 focus:outline-none cursor-pointer"
              >
                <option value="tous">Tous les messages</option>
                <option value="non_lu">Non lus</option>
                <option value="lu">Lus</option>
                <option value="repondu">Répondus</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des messages */}
        <div className="space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message._id}
              onClick={() => setSelectedMessage(message)}
              className={`bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-md transition-shadow ${
                message.statut === 'non_lu' ? 'border-l-4 border-l-red-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{message.nom}</h3>
                    <span className="text-slate-500">•</span>
                    <span className="text-sm text-slate-600">{message.email}</span>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(message.statut)}`}>
                      {getStatusIcon(message.statut)}
                      {message.statut === 'non_lu' ? 'Non lu' : 
                       message.statut === 'lu' ? 'Lu' : 'Répondu'}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{getSubjectLabel(message.sujet)}</p>
                  <p className="text-slate-700 line-clamp-2">{message.contenu}</p>
                </div>
                <div className="text-right text-sm text-slate-500 ml-4">
                  {formatDate(message.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {searchTerm || filterStatus !== 'tous' ? 'Aucun message trouvé' : 'Aucun message'}
            </h3>
            <p className="text-slate-600">
              {searchTerm || filterStatus !== 'tous' 
                ? 'Essayez de modifier vos critères de recherche.' 
                : 'Les messages de contact apparaîtront ici.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
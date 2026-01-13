import { useEffect, useState } from 'react';
import { Mail, Calendar } from 'lucide-react';
import { adminAPI } from '../../lib/api';
import { Message } from '../../types';

interface MessagesProps {
  token: string;
}

export function Messages({ token }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, [token]);

  const loadMessages = async () => {
    try {
      const response = await adminAPI('messages', 'GET', undefined, token);
      setMessages(response);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoading(false);
    }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages reçus</h1>

      {messages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-600 text-lg">Aucun message pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageCard key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
}

function MessageCard({ message }: { message: Message }) {
  const date = new Date(message.date);
  const formattedDate = date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{message.nom}</h3>
          <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
            <Mail className="w-4 h-4" />
            {message.email}
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Calendar className="w-4 h-4" />
          {formattedDate}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg p-4 mt-4">
        <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
      </div>
    </div>
  );
}

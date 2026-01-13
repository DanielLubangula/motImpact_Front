import { useState, useEffect } from 'react';
import { adminAPI } from '../lib/api';

interface NotificationData {
  unreadCount: number;
  lastChecked: string;
}

export function useMessageNotifications(token: string | null) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastChecked, setLastChecked] = useState<string>(
    localStorage.getItem('messagesLastChecked') || new Date().toISOString()
  );

  const fetchUnreadCount = async () => {
    if (!token) return;
    
    try {
      const response = await adminAPI('messages', 'GET', null, token);
      if (response && response.status === 'success') {
        const messages = response.data.messages || [];
        const unread = messages.filter((msg: any) => msg.statut === 'non_lu').length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Erreur récupération messages:', error);
    }
  };

  const markAsChecked = () => {
    const now = new Date().toISOString();
    setLastChecked(now);
    localStorage.setItem('messagesLastChecked', now);
    setUnreadCount(0);
  };

  const checkForNewMessages = async () => {
    if (!token) return;
    
    try {
      const response = await adminAPI('messages', 'GET', null, token);
      if (response && response.status === 'success') {
        const messages = response.data.messages || [];
        const newMessages = messages.filter((msg: any) => 
          msg.statut === 'non_lu' && new Date(msg.created_at) > new Date(lastChecked)
        );
        
        if (newMessages.length > 0) {
          setUnreadCount(prev => prev + newMessages.length);
          
          // Notification browser si supportée
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Nouveau message reçu', {
              body: `Vous avez ${newMessages.length} nouveau(x) message(s)`,
              icon: '/favicon.ico'
            });
          }
        }
      }
    } catch (error) {
      console.error('Erreur vérification nouveaux messages:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUnreadCount();
      
      // Vérifier les nouveaux messages toutes les 30 secondes
      const interval = setInterval(checkForNewMessages, 30000);
      
      return () => clearInterval(interval);
    }
  }, [token, lastChecked]);

  // Demander permission pour les notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    unreadCount,
    markAsChecked,
    refreshCount: fetchUnreadCount
  };
}
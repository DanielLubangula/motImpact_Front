import { useState, useEffect, useCallback } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const fetchUnreadCount = useCallback(async () => {
    if (!token || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await adminAPI('messages', 'GET', null, token);
      if (response && response.status === 'success') {
        const messages = response.data.messages || [];
        const unread = messages.filter((msg: any) => msg.statut === 'non_lu').length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Erreur récupération messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isLoading]);

  const markAsChecked = useCallback(() => {
    const now = new Date().toISOString();
    setLastChecked(now);
    localStorage.setItem('messagesLastChecked', now);
    setUnreadCount(0);
  }, []);

  const checkForNewMessages = useCallback(async () => {
    if (!token || isLoading) return;
    
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
  }, [token, lastChecked, isLoading]);

  useEffect(() => {
    if (token) {
      fetchUnreadCount();
      
      // Vérifier les nouveaux messages toutes les 60 secondes (au lieu de 30)
      const interval = setInterval(checkForNewMessages, 60000);
      
      return () => clearInterval(interval);
    }
  }, [token, fetchUnreadCount, checkForNewMessages]);

  // Demander permission pour les notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return {
    unreadCount,
    markAsChecked,
    refreshCount: fetchUnreadCount,
    isLoading
  };
}
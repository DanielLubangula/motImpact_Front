import { useState, useEffect, useCallback } from 'react';
import { adminAPI } from '../lib/api';

interface UnreadMessagesHook {
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refreshUnreadCount: () => Promise<void>;
}

export function useUnreadMessages(token: string | null, refreshInterval = 30000): UnreadMessagesHook {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI('messages/unread/count', 'GET', null, token);
      
      if (response?.status === 'success') {
        setUnreadCount(response.data.count || 0);
      } else {
        throw new Error(response?.message || 'Erreur lors du chargement');
      }
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du chargement du nombre de messages non lus');
      console.error('Erreur fetchUnreadCount:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const refreshUnreadCount = useCallback(async () => {
    await fetchUnreadCount();
  }, [fetchUnreadCount]);

  useEffect(() => {
    if (token) {
      fetchUnreadCount();
      
      // Actualisation automatique
      const interval = setInterval(fetchUnreadCount, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [token, fetchUnreadCount, refreshInterval]);

  return {
    unreadCount,
    loading,
    error,
    refreshUnreadCount
  };
}
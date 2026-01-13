import { useState, useEffect } from 'react';
import { adminAPI } from '../lib/api';

export function useSetupCheck() {
  const [setupRequired, setSetupRequired] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await adminAPI('check-setup');
        setSetupRequired(response.data.setupRequired);
      } catch (error) {
        console.error('Erreur lors de la vérification du setup:', error);
        setSetupRequired(false);
      } finally {
        setLoading(false);
      }
    };

    checkSetup();
  }, []);

  return { setupRequired, loading };
}
const API_BASE = 'http://localhost:5000/api';

// Fonction pour gérer la déconnexion automatique
function handleTokenExpired() {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin/login';
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Important pour les cookies
    headers: {
      // Ne pas définir Content-Type pour FormData
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    // Si la réponse n'est pas du JSON valide
    data = { message: 'Erreur de communication avec le serveur' };
  }
  
  if (!response.ok) {
    // Extraire le message d'erreur du serveur
    const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
    
    // Vérifier si c'est une erreur de token expiré
    if (response.status === 401 || 
        errorMessage.toLowerCase().includes('token expiré') ||
        errorMessage.toLowerCase().includes('token expired') ||
        errorMessage.toLowerCase().includes('unauthorized')) {
      handleTokenExpired();
      return; // Arrêter l'exécution car on redirige
    }
    
    throw new Error(errorMessage);
  }

  return data;
}

export async function publicAPI(endpoint: string, method: string = 'GET', body?: any) {
  return apiCall(`public/${endpoint}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function adminAPI(endpoint: string, method: string = 'GET', body?: any, token?: string) {
  const headers: any = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    return await apiCall(`admin/${endpoint}`, {
      method,
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
      headers,
    });
  } catch (error: any) {
    // Double vérification pour les erreurs de token dans adminAPI
    if (error.message && (
        error.message.toLowerCase().includes('token expiré') ||
        error.message.toLowerCase().includes('token expired') ||
        error.message.toLowerCase().includes('unauthorized')
      )) {
      handleTokenExpired();
      return;
    }
    throw error;
  }
}

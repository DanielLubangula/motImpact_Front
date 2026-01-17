const API_BASE = 'https://motimpact-back.onrender.com/api';

// Cache simple pour éviter les requêtes répétées
const requestCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30000; // 30 secondes

// Fonction pour gérer la déconnexion automatique
function handleTokenExpired() {
  localStorage.removeItem('adminToken');
  window.location.href = '/admin/login';
}

function getCacheKey(endpoint: string, options: RequestInit): string {
  return `${endpoint}_${options.method || 'GET'}_${JSON.stringify(options.body || {})}`;
}

function isValidCache(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}/${endpoint}`;
  
  // Utiliser le cache pour les requêtes GET uniquement
  if (!options.method || options.method === 'GET') {
    const cacheKey = getCacheKey(endpoint, options);
    const cached = requestCache.get(cacheKey);
    
    if (cached && isValidCache(cached.timestamp)) {
      return cached.data;
    }
  }
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: 'Erreur de communication avec le serveur' };
  }
  
  if (!response.ok) {
    const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
    
    if (response.status === 401 || 
        errorMessage.toLowerCase().includes('token expiré') ||
        errorMessage.toLowerCase().includes('token expired') ||
        errorMessage.toLowerCase().includes('unauthorized')) {
      handleTokenExpired();
      return;
    }
    
    throw new Error(errorMessage);
  }

  // Mettre en cache les requêtes GET réussies
  if (!options.method || options.method === 'GET') {
    const cacheKey = getCacheKey(endpoint, options);
    requestCache.set(cacheKey, { data, timestamp: Date.now() });
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
    const result = await apiCall(`admin/${endpoint}`, {
      method,
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
      headers,
    });
    
    // Vider le cache après les opérations de modification
    if (method !== 'GET') {
      clearCache();
    }
    
    return result;
  } catch (error: any) {
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

// Fonction pour vider le cache
export function clearCache() {
  requestCache.clear();
}

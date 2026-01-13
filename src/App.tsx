import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Biographie } from './pages/Biographie';
import { Livres } from './pages/Livres';
import { DetailLivre } from './pages/DetailLivre';
import { Actualites } from './pages/Actualites';
import { DetailActualite } from './pages/DetailActualite';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLivres } from './pages/admin/AdminLivres';
import { AdminActualites } from './pages/admin/AdminActualites';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminProfil } from './pages/admin/AdminProfil';
import { AdminSetup } from './pages/admin/AdminSetup';

// Fonction pour vérifier si le token est expiré
function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true; // Si on ne peut pas décoder le token, on le considère comme expiré
  }
}

function AppContent() {
  const location = useLocation();
  const [adminToken, setAdminToken] = useState<string | null>(
    localStorage.getItem('adminToken')
  );
  const [tokenChecked, setTokenChecked] = useState(false);

  // Vérifier le token au chargement
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('adminToken');
      if (token && isTokenExpired(token)) {
        handleLogout();
      }
      setTokenChecked(true);
    };

    checkToken();
  }, []);

  const handleLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
  };

  // Attendre que la vérification du token soit terminée
  if (!tokenChecked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Vérifier si on est sur une page admin
  const isAdminPage = location.pathname.startsWith('/admin');
  // Afficher navbar/footer sur les pages publiques
  const showPublicLayout = !isAdminPage;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {showPublicLayout && (
        <Navigation
          isAdmin={!!adminToken}
          onLogout={handleLogout}
          adminToken={adminToken}
        />
      )}

      <main className="flex-1">
        <Routes>
          {!adminToken ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/biographie" element={<Biographie />} />
              <Route path="/livres" element={<Livres />} />
              <Route path="/livres/:id" element={<DetailLivre />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/actualites/:id" element={<DetailActualite />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/admin/login"
                element={<AdminLogin onLogin={handleLogin} />}
              />
              <Route
                path="/admin/setup"
                element={<AdminSetup />}
              />
              <Route path="/admin/*" element={<Navigate to="/admin/login" />} />
              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            <>
              {/* Routes publiques accessibles même en tant qu'admin */}
              <Route path="/" element={<Home />} />
              <Route path="/biographie" element={<Biographie />} />
              <Route path="/livres" element={<Livres />} />
              <Route path="/livres/:id" element={<DetailLivre />} />
              <Route path="/actualites" element={<Actualites />} />
              <Route path="/actualites/:id" element={<DetailActualite />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Routes admin */}
              <Route path="/admin/login" element={<Navigate to="/admin/dashboard" />} />
              <Route
                path="/admin/dashboard"
                element={<AdminDashboard token={adminToken} />}
              />
              <Route
                path="/admin/livres"
                element={<AdminLivres token={adminToken} />}
              />
              <Route
                path="/admin/actualites"
                element={<AdminActualites token={adminToken} />}
              />
              <Route
                path="/admin/messages"
                element={<AdminMessages token={adminToken} />}
              />
              <Route path="/admin/profil" element={<AdminProfil token={adminToken} />} />
              <Route path="*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </main>

      {showPublicLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

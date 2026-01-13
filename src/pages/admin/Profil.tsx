import { useEffect, useState } from 'react';
import { adminAPI } from '../../lib/api';

interface ProfilProps {
  token: string;
}

export function Profil({ token }: ProfilProps) {
  const [formData, setFormData] = useState({
    biographie: '',
    photo: '',
    email_contact: '',
    réseaux_sociaux: {},
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      réseaux_sociaux: { ...prev.réseaux_sociaux, [platform]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI('profil', 'PUT', formData, token);
   
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profil auteur</h1>

      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg font-semibold">
          Profil mis à jour avec succès !
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-8 space-y-8">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Biographie complète</label>
          <textarea
            name="biographie"
            value={formData.biographie}
            onChange={handleChange}
            rows={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">URL de la photo</label>
          <input
            type="url"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email de contact</label>
          <input
            type="email"
            name="email_contact"
            value={formData.email_contact}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Réseaux sociaux</h3>
          <div className="space-y-4">
            {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-semibold text-gray-900 mb-2 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  value={(formData.réseaux_sociaux as any)[platform] || ''}
                  onChange={(e) => handleSocialChange(platform, e.target.value)}
                  placeholder={`https://${platform}.com/...`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Mise à jour...' : 'Sauvegarder les modifications'}
        </button>
      </form>
    </div>
  );
}

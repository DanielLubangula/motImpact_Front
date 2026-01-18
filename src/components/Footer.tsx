// import { useEffect, useState } from 'react';
// import { Feather, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
// import { publicAPI } from '../lib/api';

// interface SocialLink {
//   network: string;
//   url: string;
// }

// const getSocialIcon = (network: string) => {
//   switch (network.toLowerCase()) {
//     case 'facebook': return Facebook;
//     case 'twitter': return Twitter;
//     case 'instagram': return Instagram;
//     case 'linkedin': return Linkedin;
//     case 'youtube': return Youtube;
//     default: return Feather;
//   }
// };

// export function Footer() {
//   const [socials, setSocials] = useState<SocialLink[]>([]);

//   useEffect(() => {
//     const loadSocials = async () => {
//       try {
//         const response = await publicAPI('socials');
//         setSocials(response.data?.social_links || []);
//       } catch (err) {
//         console.error('Erreur chargement réseaux sociaux:', err);
//       }
//     };
//     loadSocials();
//   }, []);
//   return (
//     <footer className="bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 text-amber-100 mt-16 md:mt-20 relative overflow-hidden">
//       {/* Motifs décoratifs */}
//       <div className="absolute inset-0 opacity-5">
//         <div className="absolute top-10 left-10 text-4xl md:text-6xl text-white">❦</div>
//         <div className="absolute top-20 right-20 text-3xl md:text-5xl text-white">✦</div>
//         <div className="absolute bottom-20 left-20 text-5xl md:text-7xl text-white">❧</div>
//         <div className="absolute bottom-10 right-10 text-3xl md:text-4xl text-white">✧</div>
//       </div>
      
//       <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 relative">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
//           {/* À propos */}
//           <div className="text-center md:text-left">
//             <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6">
//               <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
//                 <Feather className="w-4 h-4 md:w-5 md:h-5 text-white" />
//               </div>
//               <h3 className="text-lg md:text-xl font-serif font-bold text-amber-100">MotImpact</h3>
//             </div>
//             <p className="text-sm md:text-base text-amber-200 font-serif italic leading-relaxed">
//               "Les mots sont les fenêtres de l'âme, ouvrant sur des mondes infinis où l'imagination prend vie."
//             </p>
//           </div>
          
//           {/* Navigation */}
//           <div className="text-center md:text-left">
//             <h4 className="text-base md:text-lg font-serif font-bold text-amber-100 mb-4 md:mb-6">Navigation</h4>
//             <ul className="space-y-2 md:space-y-3">
//               <li>
//                 <a href="/" className="text-sm md:text-base text-amber-200 hover:text-amber-100 transition-colors font-serif relative group inline-block">
//                   Accueil
//                   <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-300 transition-all group-hover:w-full"></span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/biographie" className="text-sm md:text-base text-amber-200 hover:text-amber-100 transition-colors font-serif relative group inline-block">
//                   Biographie
//                   <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-300 transition-all group-hover:w-full"></span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/livres" className="text-sm md:text-base text-amber-200 hover:text-amber-100 transition-colors font-serif relative group inline-block">
//                   Œuvres
//                   <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-300 transition-all group-hover:w-full"></span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/actualites" className="text-sm md:text-base text-amber-200 hover:text-amber-100 transition-colors font-serif relative group inline-block">
//                   Actualités
//                   <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-300 transition-all group-hover:w-full"></span>
//                 </a>
//               </li>
//               <li>
//                 <a href="/contact" className="text-sm md:text-base text-amber-200 hover:text-amber-100 transition-colors font-serif relative group inline-block">
//                   Correspondance
//                   <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-300 transition-all group-hover:w-full"></span>
//                 </a>
//               </li>
//             </ul>
//           </div>
          
//           {/* Contact */}
//           <div className="text-center md:text-left">
//             <h4 className="text-base md:text-lg font-serif font-bold text-amber-100 mb-4 md:mb-6">Correspondance</h4>
//             <div className="space-y-3 md:space-y-4">
//               <div className="flex items-center justify-center md:justify-start gap-3">
//                 <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
//                   <Mail className="w-3 h-3 md:w-4 md:h-4 text-amber-100" />
//                 </div>
//                 <span className="text-xs md:text-sm text-amber-200 font-serif">contact@motimpact.cd</span>
//               </div>
//               <div className="flex items-center justify-center md:justify-start gap-3">
//                 <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
//                   <Phone className="w-3 h-3 md:w-4 md:h-4 text-amber-100" />
//                 </div>
//                 <span className="text-xs md:text-sm text-amber-200 font-serif">+243 (0)81 234 56 78</span>
//               </div>
//               <div className="flex items-center justify-center md:justify-start gap-3">
//                 <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
//                   <MapPin className="w-3 h-3 md:w-4 md:h-4 text-amber-100" />
//                 </div>
//                 <span className="text-xs md:text-sm text-amber-200 font-serif">Kinshasa, RDC</span>
//               </div>
              
//               {/* Réseaux sociaux */}
//               {socials.length > 0 && (
//                 <div className="mt-4 md:mt-6">
//                   <h5 className="text-sm font-serif font-semibold text-amber-100 mb-3 text-center md:text-left">Suivez-moi</h5>
//                   <div className="flex justify-center md:justify-start gap-3">
//                     {socials.map((social, index) => {
//                       const IconComponent = getSocialIcon(social.network);
//                       return (
//                         <a
//                           key={index}
//                           href={social.url}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className="w-8 h-8 bg-amber-700 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors"
//                         >
//                           <IconComponent className="w-4 h-4 text-amber-100" />
//                         </a>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
        
//         {/* Séparateur décoratif */}
//         <div className="border-t border-amber-700 pt-6 md:pt-8">
//           <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//             <p className="text-xs md:text-sm text-amber-300 font-serif text-center md:text-left">
//               &copy; {new Date().getFullYear()} MotImpact. Tous droits réservés.
//             </p>
//             <div className="flex items-center gap-2">
//               <span className="text-xs md:text-sm text-amber-300 font-serif italic">
//                 "Écrit avec passion"
//               </span>
//               <div className="w-4 h-4 text-amber-400">✦</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }

import { useEffect, useState } from 'react';
import { Feather, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { publicAPI } from '../lib/api';

interface SocialLink {
  network: string;
  url: string;
}

interface ContactInfo {
  email_contact: string;
  telephone: string;
}

const getSocialIcon = (network: string) => {
  switch (network.toLowerCase()) {
    case 'facebook': return Facebook;
    case 'twitter': return Twitter;
    case 'instagram': return Instagram;
    case 'linkedin': return Linkedin;
    case 'youtube': return Youtube;
    default: return Feather;
  }
};

export function Footer() {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ email_contact: '', telephone: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les réseaux sociaux
        const socialsResponse = await publicAPI('socials');
        setSocials(socialsResponse.data?.social_links || []);

        // Charger les informations de contact
        const contactResponse = await publicAPI('getcontact');
        setContactInfo({
          email_contact: contactResponse.data?.email_contact || '',
          telephone: contactResponse.data?.telephone || ''
        });
      } catch (err) {
        console.error('Erreur chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <footer className="bg-gradient-to-br from-amber-900 via-orange-900 to-yellow-900 text-amber-100 mt-16 md:mt-20 relative overflow-hidden">
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 text-4xl md:text-6xl text-white">❦</div>
        <div className="absolute top-20 right-20 text-3xl md:text-5xl text-white">✦</div>
        <div className="absolute bottom-20 left-20 text-5xl md:text-7xl text-white">❧</div>
        <div className="absolute bottom-10 right-10 text-3xl md:text-4xl text-white">✧</div>
      </div>
      
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* À propos */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                <Feather className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-serif font-bold text-amber-100">MotImpact</h3>
            </div>
            <p className="text-sm md:text-base text-amber-200 font-serif italic leading-relaxed">
              "Les mots sont les fenêtres de l'âme, ouvrant sur des mondes infinis où l'imagination prend vie."
            </p>
          </div>
          
          {/* Navigation */}
          <div className="text-center md:text-left">
            <h4 className="text-base md:text-lg font-serif font-bold text-amber-100 mb-4 md:mb-6">Navigation</h4>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="/" className="text-sm md:text-base text-amber-200 hover:text-amber-100 transition-colors font-serif relative group inline-block">
                  Accueil
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-300 transition-all group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="/biographie" className="text-sm md:text-base text-amber-200 hover:text-amber-100 transition-colors font-serif relative group inline-block">
                  Biographie
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-300 transition-all group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="/livres" className="text-sm md:text-base text-amber-200 hover:text-amber-100 transition-colors font-serif relative group inline-block">
                  Œuvres
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-300 transition-all group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="/actualites" className="text-sm md:text-base text-amber-200 hover:text-amber-100 transition-colors font-serif relative group inline-block">
                  Actualités
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-300 transition-all group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm md:text-base text-amber-200 hover:text-amber-100 transition-colors font-serif relative group inline-block">
                  Correspondance
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-300 transition-all group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="text-center md:text-left">
            <h4 className="text-base md:text-lg font-serif font-bold text-amber-100 mb-4 md:mb-6">Correspondance</h4>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 h-3 md:w-4 md:h-4 text-amber-100" />
                </div>
                <span className="text-xs md:text-sm text-amber-200 font-serif">
                  {loading ? 'Chargement...' : (contactInfo.email_contact || 'Non disponible')}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3 h-3 md:w-4 md:h-4 text-amber-100" />
                </div>
                <span className="text-xs md:text-sm text-amber-200 font-serif">
                  {loading ? 'Chargement...' : (contactInfo.telephone || 'Non disponible')}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3 h-3 md:w-4 md:h-4 text-amber-100" />
                </div>
                <span className="text-xs md:text-sm text-amber-200 font-serif">Kinshasa, RDC</span>
              </div>
              
              {/* Réseaux sociaux */}
              {socials.length > 0 && (
                <div className="mt-4 md:mt-6">
                  <h5 className="text-sm font-serif font-semibold text-amber-100 mb-3 text-center md:text-left">Suivez-moi</h5>
                  <div className="flex justify-center md:justify-start gap-3">
                    {socials.map((social, index) => {
                      const IconComponent = getSocialIcon(social.network);
                      return (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-amber-700 hover:bg-amber-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          <IconComponent className="w-4 h-4 text-amber-100" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Séparateur décoratif */}
        <div className="border-t border-amber-700 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs md:text-sm text-amber-300 font-serif text-center md:text-left">
              &copy; {new Date().getFullYear()} MotImpact. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-amber-300 font-serif italic">
                "Écrit avec passion"
              </span>
              <div className="w-4 h-4 text-amber-400">✦</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
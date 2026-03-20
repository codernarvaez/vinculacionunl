import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setIsVisible(false);
    // Here we would initialize analytics scripts
    window.dispatchEvent(new Event('cookie_consent_accepted'));
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setIsVisible(false);
  };

  const handleConfigure = () => {
    // For now, redirect to cookie policy or open modal
    // Here we just accept technically necessary cookies
    localStorage.setItem('cookie_consent', 'configured');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-surface-dark border-t border-gray-800 p-6 z-[100] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up">
      <div className="flex-1 max-w-4xl">
        <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-2">
          <span className="material-icons text-primary">cookie</span>
          Aviso de Privacidad y Cookies
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Utilizamos cookies propias y de terceros para fines analíticos y para mostrarle contenido personalizado en base a un perfil elaborado a partir de sus hábitos de navegación. Puede obtener más información en nuestra <Link to="/politica-cookies" className="text-primary hover:underline">Política de Cookies</Link>. Haga clic en el botón "Aceptar" para confirmar que ha leído y aceptado la información presentada.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <button 
          onClick={handleConfigure}
          className="px-4 py-2 border border-gray-600 text-gray-300 rounded hover:bg-gray-800 hover:text-white transition-colors text-sm font-medium"
        >
          Configurar
        </button>
        <button 
          onClick={handleReject}
          className="px-4 py-2 border border-red-500/50 text-red-400 rounded hover:bg-red-500 hover:text-white transition-colors text-sm font-medium"
        >
          Rechazar
        </button>
        <button 
          onClick={handleAccept}
          className="px-6 py-2 bg-primary text-black font-bold rounded hover:bg-opacity-90 transition-colors shadow-lg shadow-primary/20 text-sm"
        >
          Aceptar Todas
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;

import React from 'react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 
        ${theme === 'light' 
          ? 'bg-white text-gray-800 border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.1)]' 
          : 'bg-surface-dark text-yellow-400 border border-gray-700 shadow-[0_0_15px_rgba(255,255,255,0.05)]'}
      `}
      aria-label="Alternar tema"
      title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
    >
      <span className="material-icons-outlined text-2xl animate-in spin-in duration-500">
        {theme === 'light' ? 'dark_mode' : 'light_mode'}
      </span>
    </button>
  );
};

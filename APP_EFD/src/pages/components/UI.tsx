import React from 'react';

// --- Interfaces ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  icon?: string;
}

// --- Input: Ahora con className opcional ---
export const InputField: React.FC<InputProps> = ({ label, id, icon, className = "", ...props }) => (
  <div className={`space-y-1.5 w-full text-left ${className}`}>
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor={id}>
      {label}
    </label>
    <div className="relative group">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-icons text-gray-500 group-focus-within:text-primary transition-colors text-lg">
            {icon}
          </span>
        </div>
      )}
      <input
        id={id}
        name={id}
        {...props}
        className={`${icon ? 'pl-10' : 'px-3'} block w-full pr-3 py-2.5 border border-gray-800 rounded bg-input-dark text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-200`}
      />
    </div>
  </div>
);

// --- Botón Primario: Manteniendo su base pero permitiendo ajustes ---
export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }> = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`w-full flex justify-center py-3 px-4 rounded shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] text-xl font-display font-semibold text-black bg-primary hover:bg-emerald-400 transition-all duration-300 transform hover:-translate-y-0.5 tracking-wide uppercase ${className}`}
  >
    {children}
  </button>
);

// --- Nuevos componentes específicos para formularios extensos ---

export const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: {value: string, label: string}[] }> = ({ label, id, options, ...props }) => (
  <div className="space-y-1.5 w-full text-left">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor={id}>{label}</label>
    <select
      id={id}
      {...props}
      className="block w-full px-3 py-2.5 border border-gray-800 rounded bg-input-dark text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-200"
    >
      <option value="" disabled>Seleccione una opción</option>
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

export const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, id, ...props }) => (
  <div className="space-y-1.5 w-full text-left">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor={id}>{label}</label>
    <textarea
      id={id}
      {...props}
      className="block w-full px-3 py-2.5 border border-gray-800 rounded bg-input-dark text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-200"
    />
  </div>
);

export const SecondaryOption = ({ icon, label, color }: { icon: string, label: string, color: string }) => (
  <button className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded hover:bg-gray-800 transition-all group">
    <span className={`material-icons text-lg mr-2 ${color}`}>{icon}</span>
    <span className="text-sm font-medium text-gray-300 group-hover:text-white">{label}</span>
  </button>
);
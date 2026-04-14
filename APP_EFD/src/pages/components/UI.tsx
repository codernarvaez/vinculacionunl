import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
// --- Interfaces ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  icon?: string;
}

// --- Input: Ahora con className opcional ---
export const InputField: React.FC<InputProps & { error?: string }> = ({ label, id, icon, className = "", error, ...props }) => (
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
      <div className="absolute mt-1 text-xs text-red-500">
        {error}
      </div>
    </div>
  </div>
);

// --- Botón Primario ---
export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }> = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`w-full flex justify-center py-3 px-4 rounded shadow-lg shadow-primary/40 text-xl font-display font-semibold text-pure-white bg-primary hover:opacity-90 transition-all duration-300 transform hover:-translate-y-0.5 tracking-wide uppercase ${className}`}
  >
    {children}
  </button>
);

export const DangerButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }> = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-6 py-2.5 rounded border border-red-500 text-red-500 font-bold uppercase text-xs hover:bg-red-500 hover:text-pure-white transition-all active:scale-95 ${className}`}
  >
    {children}
  </button>
);

export const SelectField: React.FC<{
  label: string;
  id: string;
  options: { value: string | number; label: string }[];
  error?: string;
  className?: string;
  [key: string]: unknown;
}> = ({ label, id, options, error, className = "", ...props }) => (
  <div className={`space-y-1.5 w-full text-left ${className}`}>
    <label htmlFor={id} className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      <select
        id={id}
        name={id}
        {...props}
        className={`block w-full px-3 py-2.5 border ${error ? "border-red-500" : "border-gray-800"
          } rounded bg-input-dark text-white text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary transition duration-200 appearance-none cursor-pointer hover:bg-opacity-80`}
      >
        <option value="" className="bg-surface-dark">Seleccionar...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface-dark text-white">
            {opt.label}
          </option>
        ))}
      </select>

      <span className="material-icons absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-lg group-focus-within:text-primary transition-colors">
        expand_more
      </span>

      {error && (
        <div className="absolute mt-1 text-[10px] font-bold text-red-500">
          {error}
        </div>
      )}
    </div>
  </div>
);
export const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string, error?: string }> = ({ label, id, error, ...props }) => (
  <div className="space-y-1.5 w-full text-left">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider" htmlFor={id}>{label}</label>
    <textarea
      id={id}
      {...props}
      className={`block w-full px-3 py-2.5 border ${error ? "border-red-500" : "border-gray-800"
        } rounded bg-input-dark text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-200`}
    />
    {error && (
      <div className="text-[10px] font-bold text-red-500 mt-1">
        {error}
      </div>
    )}
  </div>
);

export const SecondaryOption = ({ icon, label, color }: { icon: string, label: string, color: string }) => (
  <button className="flex items-center justify-center px-4 py-2 border border-gray-700 rounded hover:bg-gray-800 transition-all group">
    <span className={`material-icons text-lg mr-2 ${color}`}>{icon}</span>
    <span className="text-sm font-medium text-gray-300 group-hover:text-white">{label}</span>
  </button>
);


// --- Stat Card  ---
export const StatCard = ({ icon, label, value, colorClass }: { icon: string, label: string, value: string, colorClass: string }) => (
  <div className="bg-surface-dark rounded-xl p-5 border border-gray-800 flex items-center gap-4 hover:border-gray-700 transition-colors shadow-lg">
    <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
      <span className="material-icons-outlined text-2xl">{icon}</span>
    </div>
    <div className="min-w-0 flex-1"> {/* min-w-0 evita que el texto se salga */}
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest truncate">{label}</p>
      <h3 className="text-2xl font-display font-bold text-white leading-none mt-1">{value}</h3>
    </div>
  </div>
);

// --- Item del Menú Lateral ---
export const SidebarItem = ({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`
    w-full group flex items-center px-4 py-3 rounded-lg transition-all duration-200
    ${active
        ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
        : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'}
  `}>
    <span className={`material-icons-outlined mr-3 transition-colors ${active ? 'text-primary' : 'text-gray-500 group-hover:text-gray-300'}`}>
      {icon}
    </span>
    <span className="font-medium text-sm tracking-wide">{label}</span>
    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#22c55e]"></div>}
  </button>
);

interface ParticipantProps {
  name: string;
  age: number;
  gender: string;
  school: string;
  condition: string;
  status: 'Activo' | 'Pendiente';
  img: string;
  gradient: string;
  uuid_participante: string;
  onDownloadPdf?: () => void;
}

export const ParticipantCard: React.FC<ParticipantProps> = ({ name, age, gender, school, condition, status, uuid_participante, img, gradient, onDownloadPdf }) => (
  <div className="bg-surface-dark rounded-xl border border-gray-800 shadow-sm hover:border-primary/50 transition-all duration-300 group flex flex-col h-full overflow-hidden">
    <div className={`relative h-24 bg-gradient-to-r ${gradient}`}>
      <div className={`absolute top-3 right-3 backdrop-blur-sm rounded-full px-2 py-0.5 text-[10px] font-bold uppercase border ${status === 'Activo' ? 'bg-black text-primary border-primary/30' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'}`}>
        {status}
      </div>
    </div>
    <div className="px-6 relative flex-grow">
      <div className="absolute -top-10 left-6">
        <div className="h-20 w-20 rounded-full border-4 border-surface-dark bg-gray-800 overflow-hidden shadow-xl">
          <img src={img} alt={name} className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="pt-12 pb-4">
        <h3 className="text-lg font-bold text-white truncate">{name}</h3>
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <span>{age} años</span>
          <span className="mx-2">•</span>
          <span>{gender}</span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center text-xs">
            <span className="material-icons-outlined text-primary mr-2 text-sm">school</span>
            <span className="text-gray-300 truncate">{school}</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="material-icons-outlined text-secondary mr-2 text-sm">medical_services</span>
            <span className="text-gray-300 truncate">{condition}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="p-4 pt-0 mt-auto flex flex-col gap-2">
      <Link to={`/athletes/detail/${uuid_participante}`} className="w-full py-2 bg-primary hover:bg-emerald-600 text-black font-bold rounded text-xs uppercase transition-colors justify-center items-center text-center">
        Ver Detalles
      </Link>
      <button
        onClick={async () => {
          const result = await Swal.fire({
            title: '¿Generar carnet?',
            text: `¿Deseas descargar el carnet PDF de ${name}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, generar',
            cancelButtonText: 'Cancelar'
          });
          if (result.isConfirmed) {
            onDownloadPdf?.();
          }
        }}
        className="w-full py-2 bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-white rounded text-xs uppercase transition-colors flex justify-center items-center gap-2"
      >
        <span className="material-icons-outlined text-sm">picture_as_pdf</span>
        Carnet PDF
      </button>
    </div>
  </div>
);


interface InfoCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  headerColor?: string;
  accentBar?: boolean;
  extraHeader?: React.ReactNode;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children, headerColor = "bg-primary-900/50", accentBar, extraHeader }) => (
  <div className="bg-surface-dark shadow-lg rounded-2xl overflow-hidden border border-gray-800 relative">
    {accentBar && <div className="absolute top-0 left-0 w-1 h-full bg-secondary shadow-[0_0_10px_#ef4444]"></div>}
    <div className={`px-6 py-4 border-b border-gray-800 flex items-center justify-between ${headerColor}`}>
      <h3 className={`text-base font-bold flex items-center gap-2 tracking-tight ${accentBar ? 'text-secondary' : 'text-primary'}`}>
        <span className="material-icons-round">{icon}</span>
        {title}
      </h3>
      {extraHeader}
    </div>
    <div className="px-6 py-6">
      {children}
    </div>
  </div>
);

// --- Item de detalle con tipografía limpia ---
export const DetailItem = ({ label, value, icon }: { label: string, value: string | React.ReactNode, icon?: string }) => (
  <div className="flex flex-col gap-1">
    <dt className="text-[10px] font-black text-gray-500 uppercase tracking-[0.15em]">{label}</dt>
    <dd className="text-sm text-gray-200 font-medium flex items-center gap-2">
      {icon && <span className="material-icons-round text-primary text-base">{icon}</span>}
      {value}
    </dd>
  </div>
);



// --- Table Components ---
export const Table = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`w-full overflow-x-auto rounded-xl border border-gray-800 shadow-sm ${className}`}>
    <table className="w-full text-left border-collapse">
      {children}
    </table>
  </div>
);

export const TableHead = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <thead className={`bg-black/40 border-b border-gray-800 text-[10px] uppercase font-black tracking-widest text-gray-400 ${className}`}>
    <tr>{children}</tr>
  </thead>
);

export const TableBody = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <tbody className={`divide-y divide-gray-800/50 bg-surface-dark ${className}`}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <tr className={`hover:bg-gray-800/20 transition-colors group ${className}`}>
    {children}
  </tr>
);

export const TableCell = ({ children, className = "", header = false }: { children: React.ReactNode, className?: string, header?: boolean }) => {
  const Tag = header ? 'th' : 'td';
  return (
    <Tag className={`px-6 py-4 whitespace-nowrap ${header ? 'font-black' : 'text-sm text-gray-300 font-medium'} ${className}`}>
      {children}
    </Tag>
  );
};

// --- Badge Component ---
export const Badge = ({ children, variant = "primary", className = "" }: { children: React.ReactNode, variant?: "primary" | "success" | "warning" | "danger" | "neutral", className?: string }) => {
  const variants = {
    primary: "bg-primary/20 text-primary border-primary/30",
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    warning: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    danger: "bg-red-500/20 text-red-500 border-red-500/30",
    neutral: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return (
    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// --- Icon Button ---
export const IconButton = ({ icon, onClick, className = "", title, variant = "neutral" }: { icon: string, onClick?: () => void, className?: string, title?: string, variant?: "primary" | "danger" | "neutral" }) => {
  const variants = {
    primary: "text-primary hover:bg-primary/10 hover:border-primary/30 border-transparent",
    danger: "text-red-500 hover:bg-red-500/10 hover:border-red-500/30 border-transparent",
    neutral: "text-gray-400 hover:text-white hover:bg-gray-800 border-transparent",
  };
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg border transition-all duration-200 flex items-center justify-center ${variants[variant]} ${className}`}
    >
      <span className="material-icons-outlined text-[20px]">{icon}</span>
    </button>
  );
};

// --- Modal Component ---
export const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ isOpen, onClose, title, children, className = "max-w-md" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`bg-surface-dark border border-gray-800 rounded-2xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gray-800/20">
          <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

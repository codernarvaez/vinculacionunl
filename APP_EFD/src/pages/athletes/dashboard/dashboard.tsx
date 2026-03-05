import React from 'react';
import { StatCard, ParticipantCard, SidebarItem } from '../../components/UI';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen bg-background-dark text-white font-body overflow-hidden">
      
      {/* Sidebar con más estilo */}
      <aside className="w-64 flex flex-col bg-[#0d0f12] border-r border-gray-800/50 relative z-20">
        {/* Logo */}
        <div className="h-24 flex items-center px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <span className="material-icons text-primary text-2xl">sports_soccer</span>
            </div>
            <h1 className="text-lg font-display font-black tracking-tighter italic">
              UNI<span className="text-primary font-bold">SPORTS</span>
            </h1>
          </div>
        </div>
        
        {/* Navegación */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Menú Principal</p>
          </div>
          <SidebarItem icon="groups" label="Mis Participantes" active />
          <SidebarItem icon="school" label="Escuelas" />
          <SidebarItem icon="calendar_today" label="Calendario" />
        </nav>

        {/* User Card en el Footer del Sidebar */}
        <div className="p-4 border-t border-gray-800/50 bg-black/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-0.5">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                <span className="material-icons-outlined text-gray-400 text-sm">person</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Juan Pérez</p>
              <p className="text-[10px] text-gray-500 uppercase font-medium">Representante</p>
            </div>
          </div>
          <button className="flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold text-secondary border border-secondary/20 hover:bg-secondary/10 rounded-lg transition-all uppercase tracking-widest">
            <span className="material-icons-outlined mr-2 text-sm">logout</span>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative p-6 lg:p-10">


        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-display font-black uppercase tracking-tight">
                Panel de <span className="text-primary"> Representates</span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">Administre sus participantes inscritos en el sistema, genere carnets e inscripciones.</p>
            </div>
            <button className="group flex items-center justify-center px-6 py-3.5 bg-primary hover:bg-emerald-400 text-black font-black rounded-xl shadow-[0_10px_20px_-5px_rgba(34,197,94,0.4)] transition-all uppercase text-xs tracking-[0.1em] active:scale-95">
              <span className="material-icons-outlined mr-2 group-hover:rotate-90 transition-transform">add</span>
              Registrar Participante
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <StatCard 
                icon="emoji_events" 
                label="Inscripciones Activas" 
                value="03" 
                colorClass="bg-primary/10 text-primary border border-primary/20" 
            />
            <StatCard 
                icon="school" 
                label="Escuelas UNL" 
                value="02" 
                colorClass="bg-blue-500/10 text-blue-400 border border-blue-500/20" 
            />
            <StatCard 
                icon="pending_actions" 
                label="En Revisión" 
                value="01" 
                colorClass="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" 
            />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gray-800/50"></div>
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Lista de Deportistas</p>
            <div className="h-px flex-1 bg-gray-800/50"></div>
          </div>

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ParticipantCard 
              name="Santiago Perez" 
              age={12} 
              gender="Masculino" 
              school="Escuela de Fútbol UNL" 
              condition="Ninguna" 
              status="Activo" 
              img="https://i.pravatar.cc/150?u=santiago" 
              gradient="from-emerald-950 to-background-dark"
            />
            {/* ... más cards ... */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
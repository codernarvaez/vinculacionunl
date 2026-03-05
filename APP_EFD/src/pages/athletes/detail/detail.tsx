import React from 'react';
import { InfoCard, DetailItem, PrimaryButton } from '../../components/UI';

const ParticipantDetail: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark text-white p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumb unificado */}
        <nav className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">
          <span className="material-icons-round text-sm">home</span>
          <span className="text-gray-700">/</span>
          <span>Participantes</span>
          <span className="text-gray-700">/</span>
          <span className="text-primary">Perfil de Sofía</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Columna Izquierda: Perfil (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-dark rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
              <div className="h-28 bg-gradient-to-br from-primary/20 to-black relative border-b border-gray-800">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div className="relative p-1 bg-surface-dark rounded-full">
                    <img 
                      src="https://i.pravatar.cc/150?u=sofia" 
                      className="h-24 w-24 rounded-full object-cover border-2 border-primary/50" 
                      alt="Perfil" 
                    />
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-primary rounded-full border-4 border-surface-dark shadow-lg"></div>
                  </div>
                </div>
              </div>
              <div className="pt-16 pb-8 px-6 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white">Sofía Ramírez</h2>
                <p className="text-xs font-bold text-primary/80 uppercase tracking-widest mt-1">Categoría Infantil B</p>
                
                <div className="flex justify-center gap-2 mt-6">
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-black uppercase">Activa</span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-[10px] font-black uppercase tracking-tighter">ID: #2023-892</span>
                </div>
              </div>
            </div>

            {/* Acciones de Carnet */}
            <div className="bg-surface-dark rounded-2xl border border-gray-800 p-6 space-y-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Acciones Rápidas</p>
              <PrimaryButton>
                <span className="material-icons-round text-base mr-2">picture_as_pdf</span>
                Carnet
              </PrimaryButton>
              <button className="w-full py-2.5 border border-gray-800 hover:border-gray-600 text-gray-400 hover:text-white transition-all text-xs font-bold uppercase rounded-lg flex items-center justify-center gap-2">
                <span className="material-icons-round text-base">qr_code_2</span>
                Código QR
              </button>
            </div>
          </div>

          {/* Columna Derecha: Datos (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Ficha Personal */}
            <InfoCard title="Datos del Deportista" icon="fingerprint">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <DetailItem label="Nombres" value="Sofía Elena" />
                <DetailItem label="Apellidos" value="Ramírez Torres" />
                <DetailItem label="Cédula de Identidad" value="172345678-9" />
                <DetailItem label="Fecha Nacimiento" value="15 de Marzo, 2012" />
                <DetailItem label="Género" value="Femenino" icon="female" />
              </div>
            </InfoCard>

            {/* Ficha Médica */}
            <InfoCard 
              title="Información Médica" 
              icon="medical_services" 
              accentBar 
              headerColor="bg-secondary/5"
            >
              <div className="space-y-6">
                <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-xl flex gap-4">
                  <span className="material-icons-round text-secondary">error</span>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-secondary uppercase tracking-widest">Asma Bronquial Leve</p>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                      Requiere uso de inhalador antes de actividad física. Alérgica a la Penicilina.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DetailItem label="Tipo de Sangre" value="O Rh+" />
                  <DetailItem label="Seguro Médico" value="Póliza #998877" />
                </div>
              </div>
            </InfoCard>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetail;
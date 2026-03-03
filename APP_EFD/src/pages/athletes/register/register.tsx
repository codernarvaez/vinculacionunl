import React, { useState } from 'react';
import { InputField, PrimaryButton, SelectField, TextAreaField } from '../../components/UI';

const ParticipantRegister: React.FC = () => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background-dark text-white font-body relative overflow-x-hidden">
      
      {/* Decoración de fondo unificada */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>
      
      <nav className="bg-surface-dark border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="material-icons text-primary">sports_soccer</span>
          <span className="font-display text-2xl font-bold tracking-tighter">UNISPORTS<span className="text-primary">KIDS</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium hidden sm:block text-gray-300">Juan Pérez</span>
          <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 border border-gray-700">
            <span className="material-icons text-sm">person</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display uppercase tracking-wider text-white">Nuevo Participante</h1>
          <p className="text-gray-400 text-sm">Complete la información para la inscripción deportiva.</p>
        </div>

        {/* Formulario */}
        <div className="bg-surface-dark border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
          <form className="p-6 sm:p-8 space-y-8">
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Foto Subida */}
              <div className="w-full md:w-1/3 flex flex-col items-center gap-4">
                <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-gray-700 bg-black/40 flex items-center justify-center relative overflow-hidden group hover:border-primary transition-colors cursor-pointer">
                  {photoPreview ? (
                    <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center">
                      <span className="material-icons text-5xl text-gray-600 group-hover:text-primary transition-colors">add_a_photo</span>
                      <p className="text-[10px] text-gray-500 uppercase font-bold mt-2">Subir Foto</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if(file) setPhotoPreview(URL.createObjectURL(file));
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 uppercase font-bold text-center leading-tight italic">
                  Rostro despejado • Fondo neutro • Máx 5MB
                </p>
              </div>

              {/* Inputs de Datos */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="Nombres" id="nombres" placeholder="Ana María" />
                <InputField label="Apellidos" id="apellidos" placeholder="López García" />
                <InputField label="Cédula" id="cedula" placeholder="1234567890" />
                <InputField label="Fecha de Nacimiento" id="fecha" type="date" />
                <SelectField label="Género" id="genero" options={[{value:'m', label:'Masculino'}, {value:'f', label:'Femenino'}]} />
                <SelectField 
                  label="Escuela Deportiva" 
                  id="escuela" 
                  options={[
                    {value: '1', label: 'Iniciación (5-7 años)'},
                    {value: '2', label: 'Infantil (8-10 años)'},
                    {value: '3', label: 'Pre-Juvenil (11-13 años)'}
                  ]} 
                />
              </div>
            </div>

            <hr className="border-gray-800" />

            <TextAreaField 
              label="Información Médica / Alergias" 
              id="medico" 
              placeholder="Describa cualquier condición o 'Ninguna'" 
              rows={3} 
            />

            <div className="bg-black/40 p-4 rounded-lg flex items-start gap-3 border border-gray-800">
              <input type="checkbox" id="consent" className="mt-1 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary" />
              <label htmlFor="consent" className="text-xs text-gray-400 leading-relaxed">
                Certifico que la información es verídica y acepto los términos y condiciones de las Escuelas de Formación UNL.
              </label>
            </div>

            {/* Botones de acción final */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-800">
              <button type="button" className="px-6 py-2.5 rounded border border-secondary text-secondary font-bold uppercase text-xs hover:bg-secondary hover:text-white transition-all">
                Cancelar
              </button>
              <PrimaryButton className="sm:w-auto px-8 text-base">
                Guardar Participante
              </PrimaryButton>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ParticipantRegister;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InfoCard, DetailItem, PrimaryButton } from '../../components/UI';
import AthletesService from '../../../services/athletes';
import type { IAthletes } from '../../../services/athletes';
import { toast } from 'sonner';
import { API_URL } from '../../../api/access';
import { generateAthletePdf } from '../../../utils/pdfGenerator';

const ParticipantDetail: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const [athlete, setAthlete] = useState<IAthletes | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAthlete = async () => {
      if (!uuid) return;

      try {
        setLoading(true);
        const data = await AthletesService.getAthleteByUUID(uuid);
        if (data) {
          setAthlete(data);
        } else {
          toast.error("No se encontró el participante");
          navigate('/athletes/dashboard');
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchAthlete();
  }, [uuid, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-black uppercase tracking-widest text-gray-500">Cargando Perfil...</p>
      </div>
    );
  }

  if (!athlete) return null;

  return (
    <div className="min-h-screen bg-background-dark text-white p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Breadcrumb Dinámico */}
        <nav className="flex items-center gap-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-10">
          <span className="material-icons-round text-sm cursor-pointer hover:text-white" onClick={() => navigate('/athletes/dashboard')}>home</span>
          <span className="text-gray-700">/</span>
          <span className="cursor-pointer hover:text-white" onClick={() => navigate('/athletes/dashboard')}>Participantes</span>
          <span className="text-gray-700">/</span>
          <span className="text-primary">Perfil de {athlete.nombres}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Columna Izquierda: Perfil */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-dark rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
              <div className="h-28 bg-gradient-to-br from-primary/20 to-black relative border-b border-gray-800">
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                  <div className="relative p-1 bg-surface-dark rounded-full">
                    <img
                      src={API_URL + "/" + athlete.foto || "https://via.placeholder.com/150"}
                      className="h-24 w-24 rounded-full object-cover border-2 border-primary/50 shadow-2xl"
                      alt="Perfil"
                    />
                    <div className="absolute bottom-1 right-1 w-5 h-5 bg-primary rounded-full border-4 border-surface-dark shadow-lg"></div>
                  </div>
                </div>
              </div>
              <div className="pt-16 pb-8 px-6 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white capitalize">
                  {athlete.nombres} {athlete.apellidos}
                </h2>
                <p className="text-xs font-bold text-primary/80 uppercase tracking-widest mt-1">
                  {athlete.genero}
                </p>

                <div className="flex justify-center gap-2 mt-6">
                  <span className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-black uppercase tracking-tighter">
                    Inscrito
                  </span>
                  <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-[10px] font-black uppercase tracking-tighter">
                    ID: #{athlete.uuid.slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones */}
            <div className="bg-surface-dark rounded-2xl border border-gray-800 p-6 space-y-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Descargas Disponibles</p>
              <PrimaryButton onClick={() => {
                toast.promise(generateAthletePdf(athlete), {
                  loading: 'Generando carnet...',
                  success: 'Carnet descargado correctamente',
                  error: 'Error al generar el carnet'
                });
              }}>
                <span className="material-icons-round text-base mr-2">picture_as_pdf</span>
                Descargar Carnet
              </PrimaryButton>
            </div>
          </div>

          {/* Columna Derecha: Datos */}
          <div className="lg:col-span-8 space-y-6">

            {/* Ficha Personal */}
            <InfoCard title="Datos del Deportista" icon="fingerprint">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                <DetailItem label="Nombres" value={athlete.nombres} />
                <DetailItem label="Apellidos" value={athlete.apellidos} />
                <DetailItem label="Cédula de Identidad" value={athlete.cedula} />
                <DetailItem label="Fecha Nacimiento" value={new Date(athlete.fechaNac).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} />
                <DetailItem label="Género" value={athlete.genero} icon={athlete.genero === 'MASCULINO' ? 'male' : 'female'} />
              </div>
            </InfoCard>

            {/* Ficha Médica Dinámica */}
            <InfoCard
              title="Información Médica"
              icon="medical_services"
              accentBar
              headerColor="bg-secondary/5"
            >
              <div className="space-y-6">
                <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-xl flex gap-4">
                  <span className="material-icons-round text-secondary">assignment_late</span>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-secondary uppercase tracking-widest">Condición Reportada</p>
                    <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                      {athlete.condicionMedica || "El representante no ha reportado condiciones médicas especiales o alergias para este participante."}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <DetailItem label="Términos Aceptados" value={athlete.acepto_terminos ? "Sí, por el Representante" : "No"} />
                  <DetailItem label="Última Actualización" value={new Date(athlete.updated_at).toLocaleDateString()} />
                </div>
              </div>
            </InfoCard>

            {/* Ficha de Escuela */}
            {athlete.escuelas && athlete.escuelas.length > 0 && (
              <InfoCard title="Escuela Asignada" icon="school" headerColor="bg-primary/5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <DetailItem label="Nombre de la Escuela" value={athlete.escuelas[0].nombre} />
                  <DetailItem label="Rango de Edad" value={`${athlete.escuelas[0].ranInferior} - ${athlete.escuelas[0].ranSuperior} años`} />
                  <div className="md:col-span-2">
                    <DetailItem label="Descripción" value={athlete.escuelas[0].descripcion} />
                  </div>
                </div>
              </InfoCard>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDetail;
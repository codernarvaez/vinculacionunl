import { useEffect, useState } from 'react';
import { StatCard, ParticipantCard, SidebarItem } from '../../components/UI';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../services/auth';
import { getNamesCurrentUser } from '../../../services/auth';
import AthletesService from '../../../services/athletes';
import type { IAthletes } from '../../../services/athletes';
import SchoolsService, { type IEscuela } from '../../../services/schools';
import { getUUIDCurrentUser } from '../../../services/auth';
import { API_URL } from '../../../api/access';
import { generateAthletePdf } from '../../../utils/pdfGenerator';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};


const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState<IAthletes[]>([]);
  const [schools, setSchools] = useState<IEscuela[]>([]);
  const [activeView, setActiveView] = useState<'participants' | 'schools' | 'calendar'>('participants');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAthletesByRepresentative = async () => {
      setLoading(true);
      try {
        const userUUID = getUUIDCurrentUser();
        const data = await AthletesService.getAthletesByRepresentativeUUID(userUUID || '');
        setAthletes(data);
      } catch (error) {
        console.error("Error fetching athletes:", error);
      } finally {
        setLoading(false);
      }
    }

    const fetchSchools = async () => {
      try {
        const data = await SchoolsService.getSchools();
        setSchools(data);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    }

    fetchAthletesByRepresentative();
    fetchSchools();
  }, [])

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderParticipants = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <StatCard
          icon="emoji_events"
          label="Inscripciones Activas"
          value={athletes.length.toString().padStart(2, '0')}
          colorClass="bg-primary/10 text-primary border border-primary/20"
        />
        <StatCard
          icon="school"
          label="Escuelas UNL"
          value={schools.length.toString().padStart(2, '0')}
          colorClass="bg-blue-500/10 text-blue-400 border border-blue-500/20"
        />
        <StatCard
          icon="pending_actions"
          label="En Revisión"
          value="00"
          colorClass="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
        />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gray-800/50"></div>
        <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Lista de Deportistas</p>
        <div className="h-px flex-1 bg-gray-800/50"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {athletes.length > 0 ? (
          athletes.map((athlete) => (
            <ParticipantCard
              key={athlete.uuid}
              name={`${athlete.nombres} ${athlete.apellidos}`}
              age={calculateAge(athlete.fechaNac)}
              gender={athlete.genero === 'MASCULINO' ? 'Masculino' : 'Femenino'}
              school={athlete.escuelas?.[0]?.nombre || 'Sin Escuela Asignada'}
              condition={athlete.condicionMedica || "Ninguna"}
              status="Activo"
              img={API_URL + "/" + athlete.foto || "https://via.placeholder.com/150"}
              gradient="bg-primary"
              uuid_participante={athlete.uuid}
              onDownloadPdf={() => {
                toast.promise(generateAthletePdf(athlete), {
                  loading: 'Generando carnet...',
                  success: 'Carnet descargado correctamente',
                  error: 'Error al generar el carnet'
                });
              }}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-surface-dark/50 rounded-2xl border border-dashed border-gray-800">
            <span className="material-icons text-gray-600 text-5xl mb-4">person_add_disabled</span>
            <p className="text-gray-500 font-medium">No se encontraron participantes registrados.</p>
            <Link to="/athletes/register" className="text-primary hover:underline text-sm mt-2 inline-block">
              Registra tu primer deportista aquí
            </Link>
          </div>
        )}
      </div>
    </>
  );

  const renderSchools = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {schools.length > 0 ? (
          schools.map((school) => (
            <div key={school.uuid} className="bg-surface-dark p-6 rounded-2xl border border-gray-800 hover:border-primary/40 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="flex gap-4 relative z-10">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <span className="material-icons text-3xl">school</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-display font-bold text-white uppercase tracking-tight">{school.nombre}</h4>
                  <p className="text-gray-400 text-sm line-clamp-2">{school.descripcion}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="px-3 py-1 bg-surface-dark border border-gray-700 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="material-icons-outlined text-xs">child_care</span>
                      Rango: {school.ranInferior} - {school.ranSuperior} años
                    </div>
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1.5">
                      <span className="material-icons-outlined text-xs">check_circle</span>
                      Disponible
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-surface-dark/50 rounded-2xl border border-dashed border-gray-800">
            <span className="material-icons text-gray-600 text-5xl mb-4">search_off</span>
            <p className="text-gray-500 font-medium">No hay escuelas disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background-dark text-white font-body overflow-hidden">

      {/* Sidebar con más estilo */}
      <aside className="w-64 flex flex-col bg-surface-dark border-r border-gray-800/50 relative z-20">
        {/* Logo */}
        <div className="h-24 flex items-center px-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <span className="material-icons text-primary text-2xl">sports_soccer</span>
            </div>
            <h1 className="text-lg font-display font-black tracking-tighter italic">
              ACTÍVATE <span className="text-primary font-bold">UNL</span>
            </h1>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Menú Principal</p>
          </div>
          <SidebarItem icon="groups" label="Mis Participantes" active={activeView === 'participants'} onClick={() => setActiveView('participants')} />
          <SidebarItem icon="school" label="Escuelas" active={activeView === 'schools'} onClick={() => setActiveView('schools')} />
        </nav>

        {/* User Card en el Footer del Sidebar */}
        <div className="p-4 border-t border-gray-800/50 bg-gray-800/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-0.5">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center overflow-hidden">
                <span className="material-icons-outlined text-gray-400 text-sm">person</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{getNamesCurrentUser()}</p>
              <p className="text-[10px] text-gray-500 uppercase font-medium">Representante</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-2.5 text-xs font-bold text-secondary border border-secondary/20 hover:bg-secondary/10 rounded-lg transition-all uppercase tracking-widest cursor-pointer">
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
                {activeView === 'participants' && <>Panel de <span className="text-primary"> Representantes</span></>}
                {activeView === 'schools' && <>Consulta de <span className="text-primary"> Escuelas</span></>}
                {activeView === 'calendar' && <>Mi <span className="text-primary"> Calendario</span></>}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {activeView === 'participants' && "Administre sus participantes inscritos en el sistema, genere carnets e inscripciones."}
                {activeView === 'schools' && "Consulte las escuelas formativas de la UNL disponibles para sus participantes."}
                {activeView === 'calendar' && "Cronograma de actividades, entrenamientos y avisos del sistema."}
              </p>
            </div>
            {activeView === 'participants' && (
              <Link
                to="/athletes/register"
                className="group inline-flex items-center justify-center px-6 py-3.5 bg-primary hover:bg-emerald-400 text-black font-black rounded-xl shadow-[0_10px_20px_-5px_rgba(34,197,94,0.4)] transition-all uppercase text-xs tracking-[0.1em] active:scale-95 no-underline"
              >
                <span className="material-icons-outlined mr-2 group-hover:rotate-90 transition-transform">add</span>
                Registrar Participante
              </Link>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="material-icons animate-spin text-primary text-5xl mb-4">sync</span>
              <p className="text-gray-500 font-medium">Cargando información...</p>
            </div>
          ) : (
            <>
              {activeView === 'participants' && renderParticipants()}
              {activeView === 'schools' && renderSchools()}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
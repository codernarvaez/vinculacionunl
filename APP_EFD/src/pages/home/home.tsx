import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SchoolsService, { type IEscuela } from '../../services/schools';

const Home: React.FC = () => {
  const [schools, setSchools] = useState<IEscuela[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const data = await SchoolsService.getSchools();
        setSchools(data);
      } catch (error) {
        console.error("Error al cargar escuelas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  return (
    <div className="min-h-screen bg-background-dark text-white font-sans overflow-x-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="text-primary text-3xl flex items-center justify-center">
            <span className="material-icons-outlined">sports_soccer</span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            ACTÍVATE <span className="text-primary font-bold">UNL</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300 font-medium">
          <a href="#inicio" className="hover:text-white transition-colors duration-200">Inicio</a>
          <a href="#mision" className="hover:text-white transition-colors duration-200">Misión</a>
          <a href="#objetivos" className="hover:text-white transition-colors duration-200">Objetivos</a>
          <a href="#escuelas" className="hover:text-white transition-colors duration-200">Escuelas</a>
          <a href="#contactanos" className="hover:text-white transition-colors duration-200">Contactanos</a>
        </div>

        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-gray-300 hover:text-white font-bold px-4 py-2 text-sm transition-colors hidden sm:block">
            Iniciar Sesión
          </Link>
          <Link to="/register" className="bg-primary text-black font-bold px-6 py-2.5 rounded hover:bg-opacity-90 transition-all duration-300 text-sm shadow-lg shadow-primary/30 transform hover:-translate-y-0.5">
            Registrarse
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main id="inicio" className="max-w-7xl mx-auto px-8 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 w-max mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary text-[10px] font-bold tracking-widest uppercase">Inscripciones Abiertas</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
            Escuelas de <br />
            <span className="text-primary line-clamp-2 pb-2">Formación Deportiva</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-md leading-relaxed mt-4">
            Únete a nuestros programas deportivos universitarios diseñados para el desarrollo motriz de niños y jóvenes. Entrenamiento experto en un entorno seguro y profesional.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-6">
            <Link to="/register" className="bg-primary text-black font-bold px-8 py-3.5 rounded hover:bg-opacity-90 transition-all duration-300 shadow-lg shadow-primary/30 transform hover:-translate-y-0.5 flex items-center gap-2">
              <span className="material-icons-outlined text-[20px]">person_add</span>
              Crear Cuenta
            </Link>
            <a href="#escuelas" className="border border-white/20 text-white font-bold px-8 py-3.5 rounded hover:bg-white/10 transition-colors duration-300 backdrop-blur-sm flex items-center gap-2">
              <span className="material-icons-outlined text-[20px]">sports</span>
              Ver Escuelas
            </a>
          </div>
        </div>

        <div className="relative z-10 animate-fade-in group">
          <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none group-hover:bg-primary/30 transition-all duration-700"></div>
          <div className="relative bg-surface-dark rounded-2xl aspect-[4/3] overflow-hidden shadow-2xl border border-white/5 flex items-center justify-center transform transition-transform group-hover:scale-[1.02] duration-500">
            <img src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&q=80&w=1200" alt="Atletas entrenando" className="w-full h-full object-cover opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-tr from-background-dark/80 via-background-dark/20 to-transparent"></div>
            {/* Decorative Sport Icons */}
            <div className="absolute bottom-6 right-6 flex gap-4">
              <div className="w-12 h-12 bg-primary text-black rounded-full flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform">
                <span className="material-icons" style={{ fontSize: '28px' }}>sports_soccer</span>
              </div>
              <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg transform -rotate-12 group-hover:rotate-0 transition-transform">
                <span className="material-icons" style={{ fontSize: '28px' }}>sports_basketball</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Escuelas Section */}
      <section id="escuelas" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Nuestras <span className="text-primary">Escuelas</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explora la variedad de disciplinas deportivas que ofrecemos. Cada escuela está diseñada por edades para asegurar un aprendizaje adecuado y divertido.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.length > 0 ? (
              schools.map(school => (
                <div key={school.uuid} className="bg-surface-dark border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-colors shadow-lg group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none group-hover:bg-primary/10 transition-colors"></div>

                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center text-primary mb-4">
                      <span className="material-icons text-2xl">fitness_center</span>
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{school.nombre}</h3>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                        <span className="material-icons-outlined text-sm">cake</span>
                        {school.ranInferior} a {school.ranSuperior} años
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                        {school.estado ? (
                          <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Activa</span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400"><span className="w-2 h-2 rounded-full bg-red-500"></span> Inactiva</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 bg-surface-dark rounded-2xl border border-white/5 text-gray-400">
                Aún no hay escuelas registradas.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Info Cards Section */}
      <section id="info" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid md:grid-cols-[2fr_1fr] gap-6">
          {/* Map Card */}
          <div className="bg-surface-dark rounded-2xl p-8 border border-white/5 space-y-6 shadow-xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none transition-opacity group-hover:opacity-100 opacity-50"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <span className="material-icons-outlined text-primary text-2xl">location_on</span>
                <h2 className="text-2xl font-bold tracking-tight">Activate UNL</h2>
              </div>
              <span className="text-sm font-medium text-gray-400">Av. Universitaria, Loja</span>
            </div>
            <div className="w-full h-56 bg-surface-dark rounded-xl overflow-hidden grayscale opacity-70 border border-white/5 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-700 relative z-10">
              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" alt="Map top view" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            </div>
          </div>

          {/* Training Hours Card */}
          <div className="bg-surface-dark rounded-2xl p-8 border border-white/5 border-l-4 border-l-primary shadow-xl relative overflow-hidden flex flex-col justify-center group">
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none">
              <span className="material-icons text-[180px]">schedule</span>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] pointer-events-none"></div>

            <div className="relative z-10 space-y-4">
              <h3 className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase">Horarios</h3>
              <div className="text-4xl lg:text-5xl font-black leading-[1.1] tracking-tighter">
                15h00 - <br /> 18h00
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mt-2 max-w-[200px]">
                De lunes a viernes. Sesiones adaptadas por grupo de edad y disciplina.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-sm text-gray-500">
        <p>Escuelas de Formación Deportiva. Universidad Nacional de Loja.</p>
        <p className="mt-1">Desarrollo Integral para Niños y Jóvenes.</p>
      </footer>
    </div>
  );
};

export default Home;

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
          <a href="#calendario" className="hover:text-white transition-colors duration-200">Calendario</a>
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

      {/* Sección 1: Misión (Introducción y Justificación) */}
      <section id="mision" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-black mb-6">Nuestra <span className="text-primary">Misión</span></h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Transformar la cultura física de Loja mediante la promoción de hábitos de vida activa,
                mejorando el bienestar integral y el desarrollo físico-motriz de nuestra comunidad.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-icons-outlined">trending_up</span>
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-tight text-sm">Propósito Principal</h4>
                  <p className="text-gray-400 text-sm mt-1">Promover hábitos de vida activa en niños, adolescentes y estamentos universitarios.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-icons-outlined">public</span>
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-tight text-sm">Visión de Impacto</h4>
                  <p className="text-gray-400 text-sm mt-1">Generar un impacto perdurable reduciendo el sedentarismo y el uso excesivo de tecnologías.</p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-2xl bg-surface-dark border border-white/5 hover:border-primary/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-icons-outlined">handshake</span>
                </div>
                <div>
                  <h4 className="font-bold text-white uppercase tracking-tight text-sm">Compromiso Institucional</h4>
                  <p className="text-gray-400 text-sm mt-1">Fortalecer el vínculo entre la UNL y la comunidad, optimizando recursos para la responsabilidad social.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group max-w-4xl mx-auto">

            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-2xl opacity-50 group-hover:opacity-75 transition duration-500"></div>

            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-background-dark">
              <img
                src="https://unl.edu.ec/sites/default/files/inline-images/UNL%20pano%203.jpg"
                alt="Misión deportiva"
                className="w-full aspect-video object-cover transform transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Objetivos */}
      <section id="objetivos" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Objetivos <span className="text-primary">Estratégicos</span></h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Fomentar la actividad física, deportiva y recreativa a través de formación,
            actividades físico-recreativas y jornadas competitivas para la comunidad de Loja y la UNL.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: 'groups', title: 'Organización', desc: 'Ejecutar eventos periódicos para estudiantes, docentes y trabajadores.' },
            { icon: 'school', title: 'Formación', desc: 'Desarrollar escuelas de iniciación deportiva respetando las fases sensibles.' },
            { icon: 'terminal', title: 'Innovación', desc: 'Implementar una plataforma para gestión y evaluación de programas.' },
            { icon: 'analytics', title: 'Evaluación', desc: 'Medir el rendimiento físico-motriz y desarrollo motor periódicamente.' },
          ].map((obj, i) => (
            <div key={i} className="bg-surface-dark p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-colors"></div>
              <span className="material-icons-outlined text-4xl text-primary mb-6 block">{obj.icon}</span>
              <h3 className="text-xl font-bold mb-3 text-white">{obj.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{obj.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sección 3: Calendario de Actividades */}
      <section id="calendario" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="bg-surface-dark border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-12">Calendario de <span className="text-primary">Actividades</span></h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-icons-outlined">event</span>
                    </span>
                    <h3 className="text-xl font-bold text-white">Eventos Periódicos</h3>
                  </div>
                  <ul className="space-y-3 text-gray-400 border-l border-white/10 ml-5 pl-6">
                    <li className="relative before:absolute before:left-[-25px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                      Juegos Intercarreras e Interfacultades
                    </li>
                    <li className="relative before:absolute before:left-[-25px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                      Día del Deporte Universitario (Diciembre 5k)
                    </li>
                  </ul>
                </div>

                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-icons-outlined">history</span>
                    </span>
                    <h3 className="text-xl font-bold text-white">Actividades Permanentes</h3>
                  </div>
                  <p className="text-gray-400 mb-4 pl-[52px]">Club "Actívate UNL":</p>
                  <div className="flex flex-wrap gap-2 pl-[52px]">
                    {['Fútbol', 'Baloncesto', 'Atletismo', 'Funcional'].map(s => (
                      <span key={s} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="group">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-icons-outlined">child_care</span>
                    </span>
                    <h3 className="text-xl font-bold text-white">Formación Infantil</h3>
                  </div>
                  <ul className="space-y-3 text-gray-400 border-l border-white/10 ml-5 pl-6">
                    <li className="relative before:absolute before:left-[-25px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                      Programas de formación perceptiva motora
                    </li>
                    <li className="relative before:absolute before:left-[-25px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                      Desarrollo de habilidades motrices básicas
                    </li>
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primary/20 transition-colors"></div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-icons-outlined text-primary">rocket_launch</span>
                    <h3 className="font-bold text-white uppercase tracking-tighter">Hito Tecnológico</h3>
                  </div>
                  <p className="text-sm text-gray-300">Desarrollo y puesta a punto del <span className="text-primary font-bold">MVP</span> del sistema de gestión deportiva.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* Sección 4: Contáctanos & Información Institucional */}
      <section id="contactanos" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Contact Info */}
          <div className="lg:col-span-2 bg-surface-dark rounded-3xl p-10 border border-white/5 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>

            <div className="relative z-10 space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="material-icons-outlined text-primary">info</span>
                  Información del Proyecto
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Institución Líder</h4>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        Universidad Nacional de Loja <br />
                        <span className="text-gray-400 text-xs text-pretty">Carrera de Pedagogía de la Actividad Física y Deporte en articulación con la Carrera de Computación</span>
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Responsable</h4>
                      <p className="text-gray-200 text-sm font-bold">Lic. Hamilton Sanmartín, Mg. Sc.</p>
                      <a href="mailto:hamilton.sanmartin@unl.edu.ec" className="text-primary text-xs hover:underline flex items-center gap-1 mt-1">
                        <span className="material-icons-outlined text-xs">email</span>
                        hamilton.sanmartin@unl.edu.ec
                      </a>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Ubicación</h4>
                      <p className="text-gray-400 text-sm flex items-start gap-2">
                        <span className="material-icons-outlined text-sm text-primary">location_on</span>
                        Ciudad de Loja, instalaciones deportivas de la UNL.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Vigencia del Proyecto</h4>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <span className="material-icons-outlined text-sm text-primary">calendar_today</span>
                        2025 - 2029
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5">
                <div className="w-full h-48 bg-black/40 rounded-2xl overflow-hidden grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700 relative group/map">
                  <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200" alt="UNL Location" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply transition-opacity group-hover/map:opacity-0"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-primary text-black px-4 py-2 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 transform group-hover/map:scale-110 transition-transform">
                      <span className="material-icons text-sm">location_on</span>
                      UNL Deportes
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats / Hours */}
          <div className="space-y-6">
            <div className="bg-surface-dark rounded-3xl p-8 border border-white/5 border-l-4 border-l-primary shadow-xl relative overflow-hidden group h-full flex flex-col justify-center">
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
                <span className="material-icons text-[150px]">schedule</span>
              </div>
              <h3 className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase mb-4">Horarios de Entrenamiento</h3>
              <div className="text-4xl font-black text-white leading-tight mb-4">
                15h00 - <br /> 18h00
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Sesiones adaptadas por grupo de edad y disciplina de lunes a viernes.
              </p>
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-dark bg-gray-800 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Avatar" />
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">+50 Estudiantes Activos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-8 pb-32">
        <div className="bg-primary rounded-[2.5rem] p-12 text-center relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-6xl font-black text-black leading-none">¿Listo para empezar?</h2>
            <p className="text-black/70 text-lg font-medium max-w-xl mx-auto">
              Únete a la mejor comunidad deportiva universitaria y desarrolla tu potencial físico y social.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link to="/register" className="bg-black text-white font-bold px-10 py-4 rounded-full hover:bg-gray-900 transition-all shadow-xl transform hover:scale-105">
                Registrarse Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="text-primary text-2xl">
              <span className="material-icons-outlined">sports_soccer</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              ACTÍVATE <span className="text-primary">UNL</span>
            </span>
          </div>
          <div className="text-gray-500 text-xs font-medium space-y-1 text-center md:text-right">
            <p>© {new Date().getFullYear()} Universidad Nacional de Loja. Todos los derechos reservados.</p>
            <p>Carrera de Pedagogía de la Actividad Física y Deporte.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

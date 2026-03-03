import { Link } from "react-router-dom";
import { InputField, PrimaryButton } from "../components/UI";

const SectionDivider = ({ title }: { title: string }) => (
    <div className="flex items-center my-6">
        <span className="h-px flex-1 bg-gray-800"></span>
        <span className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
        <span className="h-px flex-1 bg-gray-800"></span>
    </div>
);

// --- Componente Principal ---

const Register: React.FC = () => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        console.log("Registro:", data);
    };

    return (
        <div className="min-h-screen bg-background-dark flex flex-col">
            {/* Navbar */}
            <nav className="w-full bg-surface-dark border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="material-icons text-primary text-3xl">sports_soccer</span>
                        <span className="font-bold text-xl text-white">LIGA<span className="text-primary">UNI</span></span>
                    </div>
                    <div className="flex gap-4">
                        <a href="#" className="text-sm text-gray-400 hover:text-white transition">Inicio</a>
                        <a href="#" className="text-sm text-primary font-medium">Iniciar Sesión</a>
                    </div>
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center p-4 relative">
                {/* Decoración de fondo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {/* Círculo Verde (Superior Izquierda) */}
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>

                    {/* Círculo Rojo (Inferior Derecha) - Subimos el z-index un poco */}
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] z-10"></div>
                </div>

                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 bg-surface-dark rounded-2xl shadow-2xl overflow-hidden border border-gray-800 z-10">

                    {/* Columna Lateral (Imagen e Info) */}
                    <div className="lg:col-span-2 relative hidden lg:flex flex-col justify-between p-8 bg-black">
                        <img
                            alt="Deportes"
                            className="absolute inset-0 w-full h-full object-cover opacity-40"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu0cyboewf85pDWj6YEXs8TOD0RBsueXRmalmFjo1jUJctTRjAc_4_FuPDok2o1ISGzv2GNlo4fIqeNfr1W17jgN4D57SPJmG1MBjKN7yBK_gda7q9qtwMCfQOz9ey5knNQo9Dd3Y7CetLaSCE-gCANLSp_GaUQ3WIAdHodhI5-pLAjP_dBzsz1EtA--IMZbBApuB1Zb5Y_62l6vdOK_PiFim_rZswcHsSQm-y_69TzOD1rqMwv6RvtWI5wmPGKk62STFxJzgm_94R"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>

                        <div className="relative z-10">
                            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center mb-6">
                                <span className="material-icons text-white">person_add</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Bienvenido</h2>
                            <p className="text-gray-400 text-sm mt-2">Registra tu cuenta como representante para gestionar deportistas.</p>
                        </div>

                        <div className="relative z-10 space-y-3">
                            {['Gestión de deportistas', 'Inscripción', 'Generación de carnets'].map((text) => (
                                <div key={text} className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="material-icons text-primary text-sm">check_circle</span>
                                    {text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Columna del Formulario */}
                    <div className="lg:col-span-3 p-8 sm:p-10">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-white">Crear Cuenta</h1>
                            <p className="text-gray-400 text-sm">Formulario para representantes legales de los deportistas</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <SectionDivider title="Datos de Identidad" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Nombres" id="nombres" icon="badge" placeholder="Ej. Juan Pérez" />
                                <InputField label="Cédula" id="cedula" icon="fingerprint" placeholder="1712345678" />
                            </div>

                            <InputField label="Domicilio" id="domicilio" icon="home" placeholder="Sector y calle principal" />
                            <InputField label="Teléfono" id="contacto" icon="phone" placeholder="09XXXXXXXX" type="tel" />

                            <SectionDivider title="Credenciales" />
                            <InputField label="Correo Electrónico" id="correo" icon="email" placeholder="usuario@correo.com" type="email" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Contraseña" id="clave" icon="lock" placeholder="••••••••" type="password" />
                                <InputField label="Confirmar" id="clave_confirm" icon="lock_reset" placeholder="••••••••" type="password" />
                            </div>

                            <div className="flex items-center gap-2 py-2">
                                <input type="checkbox" id="terms" className="rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary" />
                                <label htmlFor="terms" className="text-xs text-gray-400">Acepto los términos y condiciones de la UNL.</label>
                                <Link to="#" className="text-xs text-primary hover:underline ml-auto">Leer términos</Link>
                            </div>

                            <PrimaryButton type="submit">
                                Completar Registro
                            </PrimaryButton>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
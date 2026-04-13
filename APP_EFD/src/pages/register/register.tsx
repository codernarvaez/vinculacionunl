import { Link } from "react-router-dom";
import { InputField, PrimaryButton } from "../components/UI";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { methodPOST } from "../../api/access";

const SectionDivider = ({ title }: { title: string }) => (
    <div className="flex items-center my-6">
        <span className="h-px flex-1 bg-gray-800"></span>
        <span className="px-3 text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</span>
        <span className="h-px flex-1 bg-gray-800"></span>
    </div>
);

import TurnstileWidget from "../../components/TurnstileWidget";

interface IRegisterForm {
    nombres: string;
    apellidos: string;
    cedula: string;
    domicilio: string;
    contacto: string;
    correo: string;
    clave: string;
    clave_confirm: string;
    acepto_terminos: boolean;
    cloudflare_token: string;
}

const initialValue: IRegisterForm = {
    nombres: "",
    apellidos: "",
    cedula: "",
    domicilio: "",
    contacto: "",
    correo: "",
    clave: "",
    clave_confirm: "",
    acepto_terminos: false,
    cloudflare_token: "",
};


const registerForm = yup.object({
    nombres: yup.string().required("El nombre es obligatorio").min(3, "Mínimo 3 caracteres").max(50, "Máximo 50 caracteres"),
    apellidos: yup.string().required("Los apellidos son obligatorios").min(3, "Mínimo 3 caracteres").max(50, "Máximo 50 caracteres"),
    cedula: yup.string().required("La cédula es obligatoria").matches(/^[0-9]+$/, "Solo números").min(10, "Mínimo 10 dígitos").max(10, "Máximo 10 dígitos"),
    domicilio: yup.string().required("El domicilio es obligatorio").min(5, "Mínimo 5 caracteres").max(125, "Máximo 125 caracteres"),
    contacto: yup.string().required("El teléfono es obligatorio").min(9, "Mínimo 9 dígitos").max(15, "Máximo 15 dígitos").matches(/^[0-9]+$/, "Solo números"),
    correo: yup.string().email("Correo inválido").required("El correo es obligatorio").max(100, "Máximo 100 caracteres"),
    clave: yup.string().min(8, "Mínimo 8 caracteres").required("La contraseña es obligatoria").max(50, "Máximo 50 caracteres"),
    clave_confirm: yup.string()
        .oneOf([yup.ref('clave')], 'Las contraseñas no coinciden')
        .required("Confirma tu contraseña"),
    acepto_terminos: yup.boolean().required("Debes aceptar la política de privacidad").oneOf([true], "Debes aceptar la política de privacidad"),
    cloudflare_token: yup.string().required("Captcha obligatorio")
}).required();


interface RegisterResponse {
    nombres: string;
    apellidos: string;
    cedula: string;
    contacto: string;
    domicilio: string;
}



// --- Componente Principal ---

const Register: React.FC = () => {

    const form = useForm<IRegisterForm>({
        defaultValues: initialValue,
        resolver: yupResolver(registerForm),
    });

    const onSubmit = async (data: IRegisterForm) => {
        const result = await Swal.fire({
            title: '¿Confirmar registro?',
            text: '¿Estás seguro de que deseas crear esta cuenta de representante?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            const response = await methodPOST<RegisterResponse, IRegisterForm>('/representantes/', data);
            console.log(response.msg);

            if (response.code === 201 && response.data) {
                toast.success(`¡Registro exitoso, ${response.data.nombres}!`, {
                    description: 'Puedes iniciar sesión con tu nueva cuenta.'
                });
                form.reset();
            } else {
                toast.error("Error desconocido al registrar");
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error al registrar", {
                    description: error.message
                });
            } else {
                toast.error("Error desconocido al registrar");
            }

        };
    }



    return (
        <div className="min-h-screen bg-background-dark flex flex-col">
            {/* Navbar */}
            {/* <nav className="w-full bg-surface-dark border-b border-gray-800 sticky top-0 z-50">
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
            </nav> */}

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
                            <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-6">
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
                            <h1 className="text-2xl font-bold text-white">Crear Cuenta del Representante</h1>
                            <p className="text-gray-400 text-sm">Formulario para representantes legales de los deportistas</p>
                        </div>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <SectionDivider title="Datos de Identidad" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField {...form.register("nombres")} error={form.formState.errors.nombres?.message} label="Nombres" id="nombres" icon="badge" placeholder="Ej. Juan Pablo" />
                                <InputField {...form.register("apellidos")} error={form.formState.errors.apellidos?.message} label="Apellidos" id="apellidos" icon="badge" placeholder="Ej. Gómez Cuenca" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField {...form.register("cedula")} error={form.formState.errors.cedula?.message} label="Cédula" id="cedula" icon="fingerprint" placeholder="1712345678" />
                                <InputField {...form.register("domicilio")} error={form.formState.errors.domicilio?.message} label="Domicilio" id="domicilio" icon="home" placeholder="Sector y calle principal" />
                            </div>


                            <InputField {...form.register("contacto")} error={form.formState.errors.contacto?.message} label="Teléfono" id="contacto" icon="phone" placeholder="09XXXXXXXX" type="tel" />

                            <SectionDivider title="Credenciales" />
                            <InputField {...form.register("correo")} error={form.formState.errors.correo?.message} label="Correo Electrónico" id="correo" icon="email" placeholder="usuario@correo.com" type="email" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField {...form.register("clave")} error={form.formState.errors.clave?.message} label="Contraseña" id="clave" icon="lock" placeholder="••••••••" type="password" />
                                <InputField {...form.register("clave_confirm")} error={form.formState.errors.clave_confirm?.message} label="Confirmar" id="clave_confirm" icon="lock_reset" placeholder="••••••••" type="password" />
                            </div>

                            <div className="flex flex-col gap-1 py-2">

                                <div className="flex items-center gap-2">
                                    <input
                                        {...form.register("acepto_terminos")}
                                        type="checkbox"
                                        id="acepto_terminos"
                                        className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-primary focus:ring-primary focus:ring-offset-gray-900 transition-colors cursor-pointer"
                                    />
                                    <label htmlFor="acepto_terminos" className="text-xs text-gray-400 cursor-pointer select-none">
                                        Acepto la <span className="text-white">Política de Privacidad</span> y el tratamiento de mis datos personales según la LOPDP.
                                    </label>
                                    <Link to="/politica-privacidad" target="_blank" className="text-xs text-primary hover:underline ml-auto font-medium shrink-0">
                                        Leer política
                                    </Link>
                                </div>

                                {form.formState.errors.acepto_terminos && (
                                    <p className="text-[10px] text-red-500 font-medium animate-in fade-in slide-in-from-top-1">
                                        {form.formState.errors.acepto_terminos.message}
                                    </p>
                                )}

                            </div>


                            <TurnstileWidget onVerify={(token: string) => form.setValue('cloudflare_token', token, { shouldValidate: true })} />
                            {form.formState.errors.cloudflare_token && (
                                <p className="text-red-500 text-xs text-center">{form.formState.errors.cloudflare_token.message}</p>
                            )}

                            <PrimaryButton type="submit">
                                Completar Registro
                            </PrimaryButton>


                            <div className="text-end">
                                <p className="text-sm text-gray-400">
                                    ¿Ya tienes cuenta? <a href="/login" className="text-primary font-bold hover:text-primary-hover transition-colors ml-1 uppercase">Inicia Sesión</a>
                                </p>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;
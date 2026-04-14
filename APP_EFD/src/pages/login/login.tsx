import React, { useState } from 'react';
import { InputField, PrimaryButton } from '../components/UI';
// import { Link } from 'react-router-dom';
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { methodPOST } from '../../api/access';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';

import TurnstileWidget from '../../components/TurnstileWidget';
import { ForgotPasswordModal } from './ForgotPasswordModal';

interface IInitialValue {
    correo: string;
    clave: string;
    cloudflare_token: string;
}

const initialValues: IInitialValue = {
    correo: "",
    clave: "",
    cloudflare_token: "",
};

interface LoginResponse {
    uuid: string;
    nombres: string;
    apellidos: string;
    rol: string;
    access_token: string;
    token_type: string;
}

const Login: React.FC = () => {

    const navigate = useNavigate();
    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

    const loginSchema = yup.object({
        correo: yup.string().email("Ingresa un correo válido").required("El correo es obligatorio"),
        clave: yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").max(50, "La contraseña no debe exceder los 50 caracteres").required("La contraseña es obligatoria"),
        cloudflare_token: yup.string().required("Validación de captcha obligatoria")
    });

    const form = useForm<IInitialValue>({
        defaultValues: initialValues,
        resolver: yupResolver(loginSchema)
    });

    const onSubmit = async (data: IInitialValue) => {
        try {

            const response = await methodPOST<LoginResponse, IInitialValue>('/cuentas/login', data);
            console.log(response.msg);

            if (response.code === 200 && response.data) {
                toast.success(`¡Bienvenido, ${response.data.nombres}!`, {
                    description: 'Iniciando sesión en UniSports...'
                });

                const setLogin = useAuthStore.getState().setLogin;
                setLogin({
                    uuid: response.data.uuid,
                    nombres: response.data.nombres + " " + response.data.apellidos,
                    rol: response.data.rol
                });

                if (response.data.rol === 'representante') {
                    navigate('/athletes/dashboard');
                } else if (response.data.rol === 'administrador') {
                    navigate('/admin/dashboard');
                } else if (response.data.rol === 'gestor') {
                    navigate('/sports-admin/dashboard');
                } else {
                    navigate('/');
                }
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error("Error al iniciar sesión", {
                    description: error.message
                });
            } else {
                toast.error("Error desconocido al iniciar sesión");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background-dark text-white font-body px-4">

            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">

                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>

                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-4 sm:p-6">
                {/* Logo Sección */}
                <div className="text-center mb-8">
                    <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-wider uppercase">
                        Actívate <span className="text-primary">UNL</span>
                    </h1>
                    <div className="h-1 w-20 bg-secondary mx-auto mt-2"></div>
                </div>

                {/* Card de Login */}
                <div className="bg-surface-dark border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-secondary via-primary to-secondary"></div>

                    <div className="p-5 sm:p-8">
                        <h2 className="text-xl sm:text-3xl font-bold font-display uppercase mb-6 sm:mb-8 text-center tracking-widest">
                            Iniciar Sesión
                        </h2>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <InputField
                                {...form.register("correo")}
                                label="Correo Electrónico"
                                id="correo"
                                type="correo"
                                icon="email"
                                error={form.formState.errors.correo?.message}
                                placeholder="usuario@universidad.edu"
                            />

                            <div>
                                <InputField
                                    {...form.register("clave")}
                                    label="Contraseña"
                                    id="password"
                                    type="password"
                                    icon="vpn_key"
                                    error={form.formState.errors.clave?.message}
                                    placeholder="••••••••"
                                />
                                <div className="flex justify-end mt-5">
                                    <button 
                                        type="button"
                                        onClick={() => setIsForgotModalOpen(true)}
                                        className="text-xs text-secondary hover:text-red-400 transition-colors font-medium bg-transparent border-none cursor-pointer"
                                    >
                                        ¿Olvidaste tu clave?
                                    </button>
                                </div>
                            </div>

                            <TurnstileWidget onVerify={(token) => form.setValue('cloudflare_token', token, { shouldValidate: true })} />
                            {form.formState.errors.cloudflare_token && (
                                <p className="text-red-500 text-xs text-center">{form.formState.errors.cloudflare_token.message}</p>
                            )}

                            <PrimaryButton type="submit">Ingresar</PrimaryButton>
                        </form>


                    </div>

                    <div className="bg-black/30 py-4 text-center border-t border-gray-800">
                        <p className="text-sm text-gray-400">
                            ¿No tienes cuenta? <a href="/register" className="text-primary font-bold hover:text-primary-hover transition-colors ml-1 uppercase">Regístrate</a>
                        </p>
                    </div>
                </div>
            </div>

            <ForgotPasswordModal 
                isOpen={isForgotModalOpen} 
                onClose={() => setIsForgotModalOpen(false)} 
            />
        </div>
    );
};

export default Login;
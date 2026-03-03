import React from 'react';
import { InputField, PrimaryButton, SecondaryOption } from '../components/UI';

const Login: React.FC = () => {
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Login intentado");
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background-dark text-white font-body">

            {/* Decoración de fondo unificada */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Círculo Verde (Superior Izquierda) */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>

                {/* Círculo Rojo (Inferior Derecha) - Usando 'secondary' que es el rojo definido */}
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md p-6">
                {/* Logo Sección */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-primary mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)] bg-black/50">
                        <span className="material-icons text-primary text-5xl">sports_soccer</span>
                    </div>
                    <h1 className="font-display text-5xl font-bold tracking-wider uppercase">
                        Uni<span className="text-primary">Sports</span>
                    </h1>
                    <div className="h-1 w-20 bg-secondary mx-auto mt-2"></div>
                </div>

                {/* Card de Login */}
                <div className="bg-surface-dark border border-gray-800 rounded-lg shadow-2xl overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-secondary via-primary to-secondary"></div>

                    <div className="p-8">
                        <h2 className="text-3xl font-bold font-display uppercase mb-8 text-center tracking-widest">
                            Iniciar Sesión
                        </h2>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <InputField
                                label="Correo Electrónico"
                                id="email"
                                type="email"
                                icon="email"
                                placeholder="usuario@universidad.edu"
                                required
                            />

                            <div>
                                <InputField
                                    label="Contraseña"
                                    id="password"
                                    type="password"
                                    icon="vpn_key"
                                    placeholder="••••••••"
                                    required
                                />
                                <div className="flex justify-end mt-2">
                                    <a href="#" className="text-xs text-secondary hover:text-red-400 transition-colors font-medium">
                                        ¿Olvidaste tu clave?
                                    </a>
                                </div>
                            </div>

                            <PrimaryButton type="submit">Ingresar</PrimaryButton>
                        </form>

                        {/* Separador */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-800"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase tracking-widest">
                                <span className="px-3 bg-surface-dark text-gray-500">O accede como</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <SecondaryOption icon="admin_panel_settings" label="Admin" color="text-secondary" />
                            <SecondaryOption icon="school" label="Escuela" color="text-primary" />
                        </div>
                    </div>

                    <div className="bg-black/30 py-4 text-center border-t border-gray-800">
                        <p className="text-sm text-gray-400">
                            ¿No tienes cuenta? <a href="/register" className="text-primary font-bold hover:text-primary-hover transition-colors ml-1 uppercase">Regístrate</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
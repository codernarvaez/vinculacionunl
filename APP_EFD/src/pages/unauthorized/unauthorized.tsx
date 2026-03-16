import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Unauthorized: React.FC = () => {
    const { user } = useAuthStore();

    const getRedirectPath = () => {
        if (!user) return '/login';
        if (user.rol === 'representante') return '/athletes/dashboard';
        if (user.rol === 'administrador') return '/admin/dashboard';
        if (user.rol === 'gestor') return '/sports-admin/dashboard';
        return '/';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0D1B14] text-white p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="text-[#00FF66] text-7xl flex justify-center">
                    <span className="material-icons-outlined" style={{ fontSize: 'inherit' }}>security</span>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-white uppercase">Acceso Denegado</h1>
                    <p className="text-gray-400 text-lg">
                        No tienes los permisos necesarios para acceder a esta página.
                    </p>
                </div>

                <div className="pt-8">
                    <Link
                        to={getRedirectPath()}
                        className="inline-flex justify-center items-center px-8 py-3 rounded-lg shadow-[0_4px_14px_0_rgba(0,255,102,0.39)] text-lg font-bold text-black bg-[#00FF66] hover:bg-[#00cc55] transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;

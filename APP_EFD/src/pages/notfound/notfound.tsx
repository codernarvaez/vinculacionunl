import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const NotFound: React.FC = () => {
    const { user } = useAuthStore();

    const getRedirectPath = () => {
        if (!user) return '/';
        if (user.rol === 'representante') return '/athletes/dashboard';
        if (user.rol === 'administrador') return '/admin/dashboard';
        if (user.rol === 'gestor') return '/sports-admin/dashboard';
        return '/';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0D1B14] text-white p-6 relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00FF66]/5 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-md w-full text-center space-y-8 relative z-10">
                <div className="text-[#00FF66] flex justify-center transform -rotate-12 hover:rotate-0 transition-transform duration-500">
                    <span className="material-icons-outlined text-[120px]">sports_soccer</span>
                </div>
                
                <div className="space-y-4">
                    <h1 className="text-8xl font-black tracking-tighter text-white">404</h1>
                    <h2 className="text-2xl font-bold tracking-tight text-white uppercase">Página no encontrada</h2>
                    <p className="text-gray-400 text-lg">
                        Oops... parece que la pelota se fue fuera de la cancha. La página que buscas no existe o fue movida.
                    </p>
                </div>

                <div className="pt-8">
                    <Link
                        to={getRedirectPath()}
                        className="inline-flex justify-center items-center px-8 py-3 rounded-lg shadow-[0_4px_14px_0_rgba(0,255,102,0.39)] text-lg font-bold text-black bg-[#00FF66] hover:bg-[#00cc55] transition-all duration-300 transform hover:-translate-y-0.5 gap-2"
                    >
                        <span className="material-icons-outlined text-xl">home</span>
                        Volver al inicio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;

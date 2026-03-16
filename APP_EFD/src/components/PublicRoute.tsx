import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, isAuth } = useAuthStore();

  if (isAuth && user) {
    if (user.rol === 'representante') return <Navigate to="/athletes/dashboard" replace />;
    if (user.rol === 'administrador') return <Navigate to="/admin/dashboard" replace />;
    if (user.rol === 'gestor') return <Navigate to="/sports-admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register/register';
import Login from './pages/login/login';
import ParticipantRegister from './pages/athletes/register/register';
import Dashboard from './pages/athletes/dashboard/dashboard';
import ParticipantDetail from './pages/athletes/detail/detail';
import AdminDashboard from './pages/admin/dashboard/dashboard';
import SportsAdminDashboard from './pages/sports_admin/dashboard/dashboard';
import Home from './pages/home/home';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Unauthorized from './pages/unauthorized/unauthorized';
import NotFound from './pages/notfound/notfound';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import CookiePolicy from './pages/legal/CookiePolicy';
import CookieBanner from './components/CookieBanner';
import './App.css';
import { Toaster } from 'sonner';
import { ThemeToggle } from './components/ThemeToggle';
import { useTheme } from './components/ThemeProvider';

function App() {
  const { theme } = useTheme();

  return (
    <>
      <Toaster position="top-right" richColors theme={theme} />
      <ThemeToggle />
      <Router>
        <CookieBanner />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
          <Route path="/politica-cookies" element={<CookiePolicy />} />
          <Route path="*" element={<NotFound />} />
          
          <Route path="/athletes/register" element={
            <PrivateRoute allowedRoles={["representante"]}>
              <ParticipantRegister />
            </PrivateRoute>
          } />
          <Route path="/athletes/dashboard" element={
            <PrivateRoute allowedRoles={["representante"]}>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/athletes/detail/:uuid" element={
            <PrivateRoute allowedRoles={["representante", "administrador", "gestor"]}>
              <ParticipantDetail />
            </PrivateRoute>
          } />
          <Route path="/admin/dashboard" element={
            <PrivateRoute allowedRoles={["administrador"]}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/sports-admin/dashboard" element={
            <PrivateRoute allowedRoles={["gestor"]}>
              <SportsAdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register/register';
import Login from './pages/login/login';
import ParticipantRegister from './pages/athletes/register/register';
import Dashboard from './pages/athletes/dashboard/dashboard';
import ParticipantDetail from './pages/athletes/detail/detail';
import AdminDashboard from './pages/admin/dashboard/dashboard';
import SportsAdminDashboard from './pages/sports_admin/dashboard/dashboard';
import './App.css';
import { Toaster } from 'sonner';


function App() {
  return (
    <>
      <Toaster position="top-right" richColors theme="dark" />
      <Router>

        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/athletes/register" element={<ParticipantRegister />} />
          <Route path="/athletes/dashboard" element={<Dashboard />} />
          <Route path="/athletes/detail/:uuid" element={<ParticipantDetail />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/sports-admin/dashboard" element={<SportsAdminDashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
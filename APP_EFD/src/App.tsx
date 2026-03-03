import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Register from './pages/register/register';
import Login from './pages/login/login';
import ParticipantRegister from './pages/athletes/register/register';
import './App.css';


function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/athletes/register" element={<ParticipantRegister />} />
      </Routes>
    </Router>
  );
}

export default App;
import React, { useState } from 'react';
import { clearBasicAuth } from './services/api';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ManualAirsoft from './pages/ManualAirsoft';
import Games from './pages/Games';
import './App.css';
import Eventos from './pages/Eventos';
import ScoreboardPage from './pages/ScoreboardPage';
import Login from './pages/Login';
import Operadores from './pages/Operadores';
import RankingTimes from './pages/RankingTimes';
import Times from './pages/Times';
import CreateTeam from './pages/CreateTeam';
import Evolucao from './pages/Evolucao';
import Loja from './pages/Loja';
import AdminPanel from './pages/AdminPanel';

import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  // Simulação de autenticação global
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('play12_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('play12_user', JSON.stringify(userData));
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('play12_user');
    clearBasicAuth();
  };

  return (
    <div className="App">
      {!isLoginPage && <Navbar user={user} onLogout={handleLogout} />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/operadores" element={<Operadores />} />
          <Route path="/times" element={<Times />} />
          <Route path="/criar-time" element={<CreateTeam />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/eventos/:gameId/scoreboard" element={<ScoreboardPage />} />
          <Route path="/ranking-times" element={<RankingTimes />} />
          <Route path="/manual-airsoft" element={<ManualAirsoft />} />
          <Route path="/jogos" element={<Games />} />
          <Route path="/evolucao" element={<Evolucao />} />
          <Route path="/loja" element={<Loja />} />
          <Route
            path="/admin"
            element={user && user.isAdmin ? <AdminPanel user={user} onLogout={handleLogout} /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </main>
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default App;

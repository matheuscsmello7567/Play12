import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rules from './pages/Rules';
import Games from './pages/Games';
import './App.css';
import Eventos from './pages/Eventos';
import Login from './pages/Login';
import ComunicadeMural from './pages/ComunicadeMural';
import Squads from './pages/Squads';
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
  };

  return (
    <div className="App">
      {!isLoginPage && <Navbar user={user} onLogout={handleLogout} />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regras" element={<Rules />} />
          <Route path="/jogos" element={<Games />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/comunidade" element={<ComunicadeMural />} />
          <Route path="/squads" element={<Squads />} />
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

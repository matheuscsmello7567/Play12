import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Operadores from './pages/Operadores';
import Times from './pages/Times';
import Eventos from './pages/Eventos';
import Ranking from './pages/Ranking';
import Manual from './pages/Manual';
import Evolucao from './pages/Evolucao';
import Loja from './pages/Loja';
import Login from './pages/Login';
import PerfilOperador from './pages/PerfilOperador';
import PerfilTime from './pages/PerfilTime';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/operadores" element={<Operadores />} />
          <Route path="/operadores/:id" element={<PerfilOperador />} />
          <Route path="/times" element={<Times />} />
          <Route path="/times/:id" element={<PerfilTime />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/ranking-times" element={<Ranking />} />
          <Route path="/manual-airsoft" element={<Manual />} />
          <Route path="/evolucao" element={<Evolucao />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;

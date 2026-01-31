import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from './Home';
import Rules from './Rules';
import Eventos from './Eventos';
import '../App.css';
import ComunicadeMural from './ComunicadeMural';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/regras" element={<Rules />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/comunidade" element={<ComunicadeMural />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapPin, FaUsers, FaBook } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/jogos');
  };
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>PLAY12</h1>
          <p>Um site destinado a jogadores de airsoft</p>
          <button className="hero-btn" onClick={handleStartClick}>COMEÇAR</button>
        </div>
      </section>

      {/* Sobre Section */}
      <section className="about">
        <div className="about-content">
          <h2>SOBRE A PLAY12</h2>
          <p>
            A Play12 Airsoft é o lugar perfeito para todos os amantes de airsoft. Aqui, você encontrará todas as informações sobre nossos eventos, jogos, notícias e muito mais. Sinta-se à vontade para navegar em nosso site e descobrir tudo o que temos a oferecer para a comunidade de airsoft. Este é o seu espaço para se conectar com outros jogadores, encontrar eventos emocionantes e ficar por dentro das últimas novidades do mundo do airsoft. Junte-se a nós e faça parte dessa incrível experiência!
          </p>
          <button className="hero-btn about-btn">SAIBA MAIS</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>RECURSOS PRINCIPAIS</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaMapPin /></div>
            <h3>Jogos</h3>
            <p>Agenda completa de eventos de airsoft com todas as informações necessárias</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaUsers /></div>
            <h3>Squads</h3>
            <p>Organize seu time, gerencie membros e participe de jogos</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaBook /></div>
            <h3>Regras</h3>
            <p>Conheça as regras de segurança</p>
          </div>
        </div>
      </section>
    </div>
  );
}
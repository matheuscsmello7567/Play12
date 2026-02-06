import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapPin, FaUsers, FaBook } from 'react-icons/fa';
import { apiFetch } from '../services/api';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [proximoJogo, setProximoJogo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/jogos/proximos')
      .then((data) => {
        if (data && data.length > 0) {
          setProximoJogo(data[0]);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar próximo jogo:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInscreverClick = () => {
    if (proximoJogo) {
      navigate('/eventos');
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>PLAY12</h1>
          <p>Um site destinado a jogadores de airsoft</p>
          {proximoJogo ? (
            <div className="proximo-jogo-hero">
              <h2>Próximo Jogo</h2>
              <div className="jogo-info">
                <h3>{proximoJogo.titulo}</h3>
                <p>
                  <strong>Data:</strong> {new Date(proximoJogo.data).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p><strong>Horário:</strong> {proximoJogo.horario}</p>
                <p><strong>Tipo:</strong> {proximoJogo.tipo}</p>
              </div>
              <button className="hero-btn" onClick={handleInscreverClick}>INSCREVER-SE</button>
            </div>
          ) : (
            <button className="hero-btn" onClick={() => navigate('/eventos')}>VER EVENTOS</button>
          )}
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
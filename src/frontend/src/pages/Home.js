import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapPin, FaUsers, FaBook } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/eventos');
  };
  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Bem-vindo ao Play12</h1>
        <p>O seu portal para eventos, jogos e comunidade de airsoft!</p>
        <img src="/images/Logo" alt="Play12 Logo" className="home-logo" />
        <button className="hero-btn" onClick={handleStartClick}>COMEÇAR</button>
      </div>
    </div>
  );
}

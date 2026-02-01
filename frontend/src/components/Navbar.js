import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import './Navbar.css';
import defaultUser from '../assets/default-user.png';

export default function Navbar({ user, onLogout }) {
  const [dropdown, setDropdown] = useState(null);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Milsim Commander
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">HOME</Link>
          </li>
          <li className="nav-item">
            <Link to="/regras" className="nav-link">REGRAS</Link>
          </li>
          <li className="nav-item">
            <Link to="/eventos" className="nav-link">EVENTOS</Link>
          </li>
          <li className="nav-item">
            <Link to="/squads" className="nav-link">SQUADS</Link>
          </li>
          <li className="nav-item">
            <Link to="/comunidade" className="nav-link">COMUNIDADE</Link>
          </li>
          <li className="nav-item">
            <Link to="/loja" className="nav-link">LOJA</Link>
          </li>
          {user && user.isAdmin && (
            <li className="nav-item">
              <Link to="/admin" className="nav-link">PAINEL</Link>
            </li>
          )}
        </ul>

        {/* Se usuário logado, mostra nome e foto, senão botão login */}
        {user ? (
          <div className="user-info" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem'}}>
            <img src={user.photo || defaultUser} alt="Usuário" style={{width: 36, height: 36, borderRadius: '50%'}} />
            <span>{user.name}</span>
            <button className="hero-btn nav-login" onClick={onLogout} style={{marginLeft: 8}}>Sair</button>
          </div>
        ) : (
          <Link to="/login" className="hero-btn nav-login" style={{marginLeft: '1rem'}}>
            <FaSignInAlt style={{marginRight: '0.5rem'}} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
}

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const [dropdown, setDropdown] = useState(null);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          PLAY12
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">HOME</Link>
          </li>

          <li className="nav-item">
            <Link to="/regras" className="nav-link">REGRAS</Link>
          </li>

          <li className="nav-item">
            <Link to="/jogos" className="nav-link">JOGOS</Link>
          </li>

          <li className="nav-item">
            <Link to="/squads" className="nav-link">SQUADS</Link>
          </li>

          {/* Aba Notícias removida */}

          <li className="nav-item">
            <Link to="/comunidade" className="nav-link">COMUNIDADE</Link>
          </li>

          <li className="nav-item">
            <Link to="/eventos" className="nav-link">EVENTOS</Link>
          </li>
          <li className="nav-item">
            <Link to="/loja" className="nav-link">LOJA</Link>
          </li>
        </ul>

        <Link to="/login" className="hero-btn nav-login" style={{marginLeft: '1rem'}}>
          <FaSignInAlt style={{marginRight: '0.5rem'}} /> Login
        </Link>
      </div>
    </nav>
  );
}

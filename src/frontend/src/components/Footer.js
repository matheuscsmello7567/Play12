import React from 'react';
import { FaYoutube, FaPhone, FaEnvelope } from 'react-icons/fa';
import { SiX, SiInstagram } from 'react-icons/si';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container grouped-footer">
        <div className="footer-section grouped-contact-social">
          <h4>CONTATO</h4>
          <p><FaPhone /> (31) 97177-0354</p>
          <p><FaEnvelope /> play12airsoft@gmail.com</p>
          <h4 style={{marginTop: '1.5rem'}}>REDES SOCIAIS</h4>
          <div className="social-links">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" title="X"><SiX /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram"><SiInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 Play12 Airsoft - Todos os direitos reservados</p>
      </div>
    </footer>
  );
}

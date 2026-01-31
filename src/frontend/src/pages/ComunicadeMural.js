import React from 'react';
import './ComunicadeMural.css';

export default function ComunicadeMural() {
  const posts = [
    {
      author: "Ranger",
      date: "2024-06-01",
      content: "Bem-vindos ao mural da comunidade Play12! Compartilhe novidades, dúvidas e sugestões."
    },
    {
      author: "Operador Alpha",
      date: "2024-06-02",
      content: "Alguém vai ao evento de domingo? Podemos combinar carona!"
    },
    {
      author: "Operador Bravo",
      date: "2024-06-03",
      content: "Sugestão: adicionar ranking de squads no site."
    }
  ];

  return (
    <div className="mural-page">
      <div className="mural-header">
        <h1>MURAL DA COMUNIDADE</h1>
        <p>Espaço para recados, dúvidas e interação entre operadores</p>
      </div>
      <div className="mural-list">
        {posts.map((post, idx) => (
          <div key={idx} className="mural-card">
            <div className="mural-meta">
              <span className="mural-author">{post.author}</span>
              <span className="mural-date">{post.date}</span>
            </div>
            <p className="mural-content">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

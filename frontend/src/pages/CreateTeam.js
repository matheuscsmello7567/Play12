import React, { useEffect, useState } from 'react';
import './CreateTeam.css';
import { apiFetch } from '../services/api';

export default function CreateTeam() {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    logo: null
  });
  const [operadores, setOperadores] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiFetch('/operadores')
      .then((response) => {
        const dataArray = response.data || response || [];
        setOperadores(Array.isArray(dataArray) ? dataArray : []);
      })
      .catch((err) => {
        setError('Erro ao carregar operadores: ' + err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMemberToggle = (operadorId) => {
    setSelectedMembers(prev => {
      if (prev.includes(operadorId)) {
        return prev.filter(id => id !== operadorId);
      } else {
        return [...prev, operadorId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nome.trim()) {
      setError('Nome do time é obrigatório');
      return;
    }

    if (selectedMembers.length === 0) {
      setError('Adicione pelo menos um membro');
      return;
    }

    const squadData = {
      nome: formData.nome,
      descricao: formData.descricao,
      qtdOperadores: selectedMembers.length,
      jogosJogados: 0,
      pontuacaoTotal: 0
    };

    try {
      // Criar squad
      const newSquad = await apiFetch('/squads', {
        method: 'POST',
        body: JSON.stringify(squadData)
      });

      // Adicionar cada operador ao squad
      for (const operadorId of selectedMembers) {
        try {
          await apiFetch(`/operadores/${operadorId}/squad/${newSquad.id}`, {
            method: 'PUT'
          });
        } catch (err) {
          console.error(`Erro ao adicionar operador ${operadorId}:`, err);
        }
      }

      setSuccess('Time criado com sucesso!');
      setFormData({ nome: '', descricao: '', logo: null });
      setSelectedMembers([]);
      setLogoPreview(null);
      setTimeout(() => window.location.href = '/times', 2000);
    } catch (err) {
      setError('Erro: ' + err.message);
    }
  };

  return (
    <div className="create-team-page">
      <div className="create-team-header">
        <h1>CRIAR TIME</h1>
        <p>Forme seu squad e comece a competir</p>
      </div>

      <div className="create-team-container">
        {error && <div className="team-error">{error}</div>}
        {success && <div className="team-success">{success}</div>}

        <form onSubmit={handleSubmit} className="team-form">
          {/* Logo Section */}
          <div className="form-section">
            <h2>Logo do Time</h2>
            <div className="logo-upload">
              <input
                type="file"
                id="logo-input"
                accept="image/*"
                onChange={handleLogoChange}
                className="logo-input"
              />
              <label htmlFor="logo-input" className="logo-label">
                {logoPreview ? (
                  <img src={logoPreview} alt="Preview" className="logo-preview" />
                ) : (
                  <div className="logo-placeholder">
                    <span>📸</span>
                    <p>Clique para adicionar logo</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="form-section">
            <h2>Informações do Time</h2>
            
            <div className="form-group">
              <label htmlFor="nome">Nome do Time *</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Ex: Bravo Team"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Conte sobre seu time..."
                rows="4"
              />
            </div>
          </div>

          {/* Members Selection */}
          <div className="form-section">
            <h2>Membros do Time *</h2>
            <p className="members-info">
              Selecionados: <strong>{selectedMembers.length}</strong>
            </p>

            {loading ? (
              <p>Carregando operadores...</p>
            ) : operadores.length === 0 ? (
              <p className="no-members">Nenhum operador disponível</p>
            ) : (
              <div className="members-grid">
                {operadores.map(op => (
                  <div
                    key={op.id}
                    className={`member-card ${selectedMembers.includes(op.id) ? 'selected' : ''}`}
                    onClick={() => handleMemberToggle(op.id)}
                  >
                    <div className="member-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(op.id)}
                        onChange={() => handleMemberToggle(op.id)}
                      />
                    </div>
                    <div className="member-info">
                      <h4>{op.nickname}</h4>
                      <p>{op.nomeCompleto}</p>
                      <span className="member-role">{op.funcao || 'Membro'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-submit">
              CRIAR TIME
            </button>
            <button type="button" className="btn-cancel" onClick={() => window.history.back()}>
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

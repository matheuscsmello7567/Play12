import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, setBasicAuth } from '../services/api';
import './Login.css';

const ADMIN_PASSWORD = 'Play12Eventos@2026';

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState('operador'); // 'operador' or 'admin'
  const [form, setForm] = useState({ email: '', password: '', name: '', nickname: '', telefone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isLogin) {
        const response = await apiFetch('/operadores/login', {
          method: 'POST',
          body: JSON.stringify({ email: form.email, senha: form.password })
        });
        setBasicAuth(form.email, form.password);
        const operador = response.data;
        if (onLogin) {
          onLogin({
            name: operador.nomeCompleto,
            email: operador.email,
            tipo: operador.tipo,
            isAdmin: operador.tipo === 'ADMIN',
            photo: null
          });
        }
        setSuccess('Login realizado com sucesso!');
        navigate('/');
      } else {
        // Validação para Admin
        if (accountType === 'admin') {
          if (form.password !== ADMIN_PASSWORD) {
            setError('Senha de admin inválida. Verifique a chave de acesso.');
            setLoading(false);
            return;
          }
          
          // Cadastro de Admin - sem email nem nickname
          const response = await apiFetch('/operadores/cadastro', {
            method: 'POST',
            body: JSON.stringify({
              nomeCompleto: form.name,
              senha: form.password,
              admin: true
            })
          });
          
          setBasicAuth('', form.password); // Admin sem email padrão
          const operador = response.data;
          if (onLogin) {
            onLogin({
              name: operador.nomeCompleto,
              email: operador.email || 'admin@play12.local',
              tipo: 'ADMIN',
              isAdmin: true,
              photo: null
            });
          }
        } else {
          // Cadastro normal de Operador
          const response = await apiFetch('/operadores/cadastro', {
            method: 'POST',
            body: JSON.stringify({
              email: form.email,
              senha: form.password,
              nomeCompleto: form.name,
              nickname: form.nickname,
              telefone: form.telefone,
              admin: false
            })
          });
          
          setBasicAuth(form.email, form.password);
          const operador = response.data;
          if (onLogin) {
            onLogin({
              name: operador.nomeCompleto,
              email: operador.email,
              tipo: operador.tipo,
              isAdmin: operador.tipo === 'ADMIN',
              photo: null
            });
          }
        }
        
        setSuccess('Cadastro realizado com sucesso!');
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
        
        {!isLogin && (
          <div className="account-type-toggle">
            <span className="toggle-label">Tipo de Conta:</span>
            <div className="toggle-switch">
              <button
                type="button"
                className={`toggle-option ${accountType === 'operador' ? 'active' : ''}`}
                onClick={() => setAccountType('operador')}
              >
                Operador
              </button>
              <button
                type="button"
                className={`toggle-option ${accountType === 'admin' ? 'active' : ''}`}
                onClick={() => setAccountType('admin')}
              >
                Admin
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Nome completo"
                value={form.name}
                onChange={handleChange}
                required
              />
              
              {accountType === 'operador' && (
                <>
                  <input
                    type="text"
                    name="nickname"
                    placeholder="Nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="tel"
                    name="telefone"
                    placeholder="Telefone (opcional)"
                    value={form.telefone}
                    onChange={handleChange}
                  />
                </>
              )}

              {accountType === 'operador' && (
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              )}
            </>
          )}

          {isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="password"
            name="password"
            placeholder={accountType === 'admin' ? 'Chave de acesso admin' : 'Senha'}
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success">{success}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>
        <p>
          {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, setBasicAuth } from '../services/api';
import './Login.css';

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', name: '', nickname: '', telefone: '', isAdmin: false });
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
        const response = await apiFetch('/operadores/cadastro', {
          method: 'POST',
          body: JSON.stringify({
            email: form.email,
            senha: form.password,
            nomeCompleto: form.name,
            nickname: form.nickname,
            telefone: form.telefone,
            admin: form.isAdmin
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
          {!isLogin && (
            <label className="admin-toggle">
              <input
                type="checkbox"
                name="isAdmin"
                checked={form.isAdmin}
                onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
              />
              Sou ADM
            </label>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Senha"
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

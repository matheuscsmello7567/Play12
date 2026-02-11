const isDevelopment = process.env.NODE_ENV === 'development';
const API_BASE = process.env.REACT_APP_API_URL || (isDevelopment ? 'http://localhost:8080/api' : '/api');

const getAuthHeader = () => {
  const auth = localStorage.getItem('play12_auth');
  return auth ? { Authorization: `Basic ${auth}` } : {};
};

export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...getAuthHeader()
  };
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers
    });
  } catch (err) {
    console.error('Erro de conexão:', err);
    // Em desenvolvimento, retornar null para permitir fallback
    if (isDevelopment && !options.method) {
      console.warn(`API ${API_BASE}${path} indisponível. Usando dados locais como fallback.`);
      return null;
    }
    throw new Error(`Servidor offline - ${err.message}`);
  }

  if (response.status === 204) return null;

  let data = null;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  } else {
    data = await response.text().catch(() => null);
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Sessão expirada ou acesso negado. Faça login novamente.');
    }
    const message = typeof data === 'string'
      ? (data || `Erro na requisição (${response.status})`)
      : (data?.message || data?.error || `Erro na requisição (${response.status})`);
    console.error('Erro na API:', { status: response.status, data, message });
    throw new Error(message);
  }
  return data;
}

export function setBasicAuth(email, password) {
  const token = btoa(`${email}:${password}`);
  localStorage.setItem('play12_auth', token);
}

export function clearBasicAuth() {
  localStorage.removeItem('play12_auth');
}

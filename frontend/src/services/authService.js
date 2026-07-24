// services/authService.js
import { apiFetch } from './api';

export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function login({ email, password }) {
  const response = await apiFetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Login failed');
  }

  const tokenData = await response.json();
  localStorage.setItem('token', tokenData.access_token);

  // Fetch me to populate user info
  const meResponse = await apiFetch('/api/auth/me', {
    headers: getAuthHeaders()
  });

  if (!meResponse.ok) {
    throw new Error('Failed to retrieve user profile after login');
  }

  const user = await meResponse.json();
  
  // Fetch company
  const companyResponse = await apiFetch(`/api/companies/${user.company_id}`, {
    headers: getAuthHeaders()
  });
  const company = companyResponse.ok ? await companyResponse.json() : null;

  return { user, company, activeRole: tokenData.active_role };
}

export async function loginAsDemo(role) {
  const demoCredentials = {
    manager:  { email: 'sneha@ashoka.com', password: 'password123' },
    employee: { email: 'sampath@ashoka.com', password: 'password123' },
    hr:       { email: 'priya@ashoka.com', password: 'password123' },
  };

  const credentials = demoCredentials[role];
  if (!credentials) {
    throw new Error(`Invalid demo role: ${role}`);
  }

  const result = await login(credentials);
  return { ...result, activeRole: role };
}

export async function logout() {
  await apiFetch('/api/auth/logout', {
    method: 'POST',
    headers: getAuthHeaders()
  });
  localStorage.removeItem('token');
  return true;
}

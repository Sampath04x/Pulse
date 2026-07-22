// services/companyService.js
import { getAuthHeaders } from './authService';

export async function getCompanies() {
  const response = await fetch('/api/companies', {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  return response.json();
}

export async function getCompany(companyId) {
  const response = await fetch(`/api/companies/${companyId}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch company');
  }
  return response.json();
}

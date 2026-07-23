// services/evaluationService.js
import { apiFetch } from './api';
import { getAuthHeaders } from './authService';
import { parameters as mockParameters } from '../data/mockData';

// Re-export rich parameters from mockData
export const parameters = mockParameters;

export async function getEvaluation(evaluationId) {
  const response = await apiFetch(`/api/evaluations/${evaluationId}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch evaluation');
  }
  return response.json();
}

export async function saveDraft(evaluationId, dimensions) {
  const response = await apiFetch(`/api/evaluations/${evaluationId}/draft`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(dimensions)
  });
  if (!response.ok) {
    throw new Error('Failed to save draft');
  }
  return response.json();
}

export async function submitEvaluation(evaluationId, dimensions) {
  const response = await apiFetch(`/api/evaluations/${evaluationId}/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(dimensions)
  });
  if (!response.ok) {
    throw new Error('Failed to submit evaluation');
  }
  return response.json();
}

export async function createEvaluation(employeeId, managerId, companyId, month, year) {
  const response = await apiFetch(`/api/evaluations/create?employee_id=${employeeId}&month=${month}&year=${year}`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to create evaluation');
  }
  return response.json();
}

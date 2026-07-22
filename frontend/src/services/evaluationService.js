// services/evaluationService.js
import { getAuthHeaders } from './authService';

export const parameters = [
  { id: 'ownership',      label: 'Ownership',       iconName: 'Target',
    tip: 'Mention one specific example. It makes a bigger impact.' },
  { id: 'communication',  label: 'Communication',    iconName: 'MessageSquare',
    tip: 'Mention one recent meeting or presentation moment.' },
  { id: 'quality',        label: 'Quality of Work',  iconName: 'Zap',
    tip: 'Highlight one specific deliverable or output they owned.' },
  { id: 'collaboration',  label: 'Collaboration',    iconName: 'Users',
    tip: 'Think about a moment they actively supported the team.' },
  { id: 'initiative',     label: 'Initiative',       iconName: 'Rocket',
    tip: 'Mention one time they went beyond what was asked of them.' },
];

export async function getEvaluation(evaluationId) {
  const response = await fetch(`/api/evaluations/${evaluationId}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch evaluation');
  }
  return response.json();
}

export async function saveDraft(evaluationId, dimensions) {
  const response = await fetch(`/api/evaluations/${evaluationId}/draft`, {
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
  const response = await fetch(`/api/evaluations/${evaluationId}/submit`, {
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
  const response = await fetch(`/api/evaluations/create?employee_id=${employeeId}&month=${month}&year=${year}`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to create evaluation');
  }
  return response.json();
}

// services/employeeService.js
import { getAuthHeaders } from './authService';

export async function getEmployeeDashboard(userId) {
  const response = await fetch('/api/employee/dashboard', {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch employee dashboard data');
  }
  return response.json();
}

export async function getGrowthHistory(userId) {
  const response = await fetch(`/api/employee/history?employee_id=${userId}`, {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch growth history');
  }
  const evaluations = await response.json();
  
  // Clean up formatting to match expected structures:
  // History is a chronological map of scores
  const history = evaluations.map(ev => ({
    month: ev.month,
    score: ev.overall_score || 0.0
  })).reverse(); // asc order

  return { evaluations, history };
}

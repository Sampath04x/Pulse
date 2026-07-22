// services/managerService.js
import { getAuthHeaders } from './authService';

export async function getManagerDashboard(managerId) {
  const response = await fetch('/api/manager/dashboard', {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch manager dashboard data');
  }
  return response.json();
}

export async function getTeamOverview(managerId) {
  const response = await fetch('/api/manager/team-overview', {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch team overview data');
  }
  return response.json();
}

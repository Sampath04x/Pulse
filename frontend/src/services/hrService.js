// services/hrService.js
import { getAuthHeaders } from './authService';

export async function getHRDashboard(companyId) {
  const response = await fetch('/api/hr/dashboard', {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch HR dashboard data');
  }
  return response.json();
}

export async function getOrgTree(companyId) {
  const response = await fetch('/api/hr/org-tree', {
    headers: getAuthHeaders()
  });
  if (!response.ok) {
    throw new Error('Failed to fetch organization tree');
  }
  return response.json();
}

export async function getNotifications() {
  return [
    { id: 'n1', type: 'warning', message: "Rahul's conversation is due today.", time: '2h ago', read: false },
    { id: 'n2', type: 'info',    message: 'Sneha shared her July conversation.', time: '5h ago', read: false },
    { id: 'n3', type: 'success', message: "Arjun's conversation is complete.", time: '1d ago', read: true },
    { id: 'n4', type: 'warning', message: 'Ananya has 3 pending conversations.', time: '2d ago', read: true },
  ];
}

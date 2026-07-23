// services/employeeService.js
import { apiFetch } from './api';
import { getAuthHeaders } from './authService';
import { growthHistory, evaluations, parameters, getUserById } from '../data/mockData';

export async function getEmployeeDashboard(userId) {
  try {
    const response = await apiFetch('/api/employee/dashboard', {
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const data = await response.json();
      // Enrich with local dimension trends
      const enriched = enrichDashboardData(data, userId);
      return enriched;
    }
  } catch {}

  // Fallback: derive from mockData
  return buildDashboardFromMock(userId);
}

function buildDashboardFromMock(userId) {
  const userEvals = evaluations.filter(e =>
    e.employeeId === userId && ['locked', 'submitted'].includes(e.status)
  );

  const latest = userEvals[0] || null;
  const prev = userEvals[1] || null;
  const history = growthHistory[userId] || [];

  const dimensionTrends = parameters.map(p => {
    const latestDim = latest?.dimensions?.find(d => d.parameterId === p.id);
    const prevDim   = prev?.dimensions?.find(d => d.parameterId === p.id);
    const score = latestDim?.score || 0;
    const prevScore = prevDim?.score || 0;
    const diff = score - prevScore;
    const trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';

    return {
      id: p.id,
      label: p.label,
      score,
      prevScore,
      diff,
      trend,
    };
  });

  return {
    latest: latest ? {
      ...latest,
      month: latest.month,
      year: latest.year,
      overallScore: latest.overallScore || 0,
      dimensions: latest.dimensions || [],
    } : null,
    history,
    dimensionTrends,
  };
}

function enrichDashboardData(data, userId) {
  const history = growthHistory[userId] || [];
  const userEvals = evaluations.filter(e =>
    e.employeeId === userId && ['locked', 'submitted'].includes(e.status)
  );
  const dimensionTrends = parameters.map(p => {
    const latestDim = userEvals[0]?.dimensions?.find(d => d.parameterId === p.id);
    const prevDim   = userEvals[1]?.dimensions?.find(d => d.parameterId === p.id);
    const score = latestDim?.score || 0;
    const prevScore = prevDim?.score || 0;
    const diff = score - prevScore;
    return {
      id: p.id,
      label: p.label,
      score,
      prevScore,
      diff,
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
    };
  });
  return { ...data, history, dimensionTrends };
}

export async function getGrowthHistory(userId) {
  try {
    const response = await apiFetch(`/api/employee/history?employee_id=${userId}`, {
      headers: getAuthHeaders()
    });
    if (response.ok) {
      const apiEvaluations = await response.json();
      const history = apiEvaluations.map(ev => ({
        month: ev.month,
        score: ev.overall_score || 0.0
      })).reverse();
      return { evaluations: apiEvaluations, history };
    }
  } catch {}

  // Fallback: derive from mockData
  const userEvals = evaluations.filter(e =>
    e.employeeId === userId && ['locked', 'submitted'].includes(e.status)
  );
  const history = growthHistory[userId] || [];

  // Derive manager from first eval
  const firstEval = userEvals[0];
  const managerId = firstEval?.managerId;
  const manager = managerId ? getUserById(managerId) : null;

  return {
    evaluations: userEvals,
    history,
    manager,
  };
}


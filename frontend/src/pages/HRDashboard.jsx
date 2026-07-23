// pages/HRDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getHRDashboard } from '../services/hrService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { StatCard } from '../components/ui/StatCard';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { GrowthAreaChart } from '../components/charts/GrowthAreaChart';
import { BarChart2, TrendingUp, AlertTriangle, Users, Shield, DownloadCloud, Bell, ChevronRight, Star } from 'lucide-react';
import {
  departmentProgress, completionTrend, topPerformers, pendingManagers, recentActivity
} from '../data/mockData';
import './HRDashboard.css';

const TOP_PERFORMERS = [
  { rank: 1, name: 'Sneha Iyer',      title: 'Design Lead',       score: 4.8, trend: 'up',     dept: 'Design' },
  { rank: 2, name: 'Sampath Kumar',   title: 'Frontend Dev',      score: 4.5, trend: 'up',     dept: 'Engineering' },
  { rank: 3, name: 'Kavita Singh',    title: 'Marketing Manager', score: 4.3, trend: 'stable', dept: 'Marketing' },
];

const DEPT_DATA = departmentProgress.ashoka;

const RECENT_ACTS = recentActivity.ashoka;

const SCORE_BANDS = [
  { label: '4.5 – 5.0 (Excellent)', pct: 30, cls: 'high' },
  { label: '3.5 – 4.4 (Good)',      pct: 50, cls: 'mid' },
  { label: 'Below 3.5 (Needs care)',pct: 20, cls: 'low' },
];

export default function HRDashboard() {
  const { currentUser, currentCompany } = useApp();
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState(null);
  const [nudgedManagers, setNudgedManagers] = useState({});

  const { data, loading } = useAsync(
    () => getHRDashboard(currentCompany?.id),
    [currentCompany?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const { overview = {}, departments = [] } = data || {};

  const completionRate = overview.completionRate || 82;
  const pendingMgrs = pendingManagers.ashoka || [];
  const overdueCount = pendingMgrs.reduce((s, m) => s + m.overdue, 0);

  const deptData = departments.length > 0 ? departments : DEPT_DATA;

  const handleNudge = (managerId) => {
    setNudgedManagers(prev => ({ ...prev, [managerId]: true }));
  };

  return (
    <PageLayout>
      {/* Page header */}
      <div className="hr-page-header fade-in">
        <div>
          <h1 className="hr-page-title">Pulse Health · {currentCompany?.name}</h1>
          <p className="hr-page-sub">Organization-wide performance visibility for {new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' })}.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="ghost" size="sm">
            <DownloadCloud size={14} style={{ marginRight: 4 }} /> Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/admin')}>
            <Shield size={14} style={{ marginRight: 4 }} /> Admin Settings
          </Button>
        </div>
      </div>

      {/* Active Cycle Banner */}
      <div className="hr-cycle-bar fade-in">
        <div className="hr-cycle-info">
          <div className="hr-cycle-label">Active Review Cycle</div>
          <div className="hr-cycle-name">July 2024 Monthly Conversations</div>
          <div className="hr-cycle-sub">Closes July 31, 2024 · 4 days remaining</div>
        </div>
        <div className="hr-cycle-actions">
          <Button variant="ghost" size="sm">Extend Deadline</Button>
          <Button variant="ghost" size="sm">
            <Bell size={13} style={{ marginRight: 4 }} /> Nudge All Pending
          </Button>
          <Button variant="primary" size="sm">Close Cycle</Button>
        </div>
      </div>

      {/* ── Health Banner ── */}
      <div className="card card-pad fade-in" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="hr-health-banner">
          <div className="hr-health-left">
            <div className="hr-health-title">Completion Rate</div>
            <div className="hr-health-pct" style={{ color: completionRate >= 80 ? 'var(--color-success)' : completionRate >= 60 ? '#D97706' : 'var(--color-danger)' }}>
              {completionRate}%
            </div>
            <ProgressBar value={completionRate} max={100} size="md" />
            <div className="hr-health-sub">
              {completionRate >= 80 ? '✓ On track' : '⚠ Below target (goal: 90%)'}
            </div>
          </div>
          <div className="hr-health-stats">
            <StatCard value={overview.totalEmployees || 8}  label="Total employees"    icon={<Users size={18} color="var(--color-primary)" />} />
            <StatCard value={overview.totalManagers || 3}   label="Managers"           icon={<Star  size={18} color="#F59E0B" />} />
            <StatCard value={overdueCount}                  label="Overdue reviews"    icon={<AlertTriangle size={18} color={overdueCount > 0 ? 'var(--color-danger)' : 'var(--color-success)'} />} trendDir={overdueCount > 0 ? 'down' : 'up'} />
            <StatCard value={`${overview.avgScore || '4.2'}/5`} label="Avg org score" icon={<TrendingUp size={18} color="var(--color-primary)" />} />
            <StatCard value={overview.selfReflections || 5} label="Self-reflections submitted" icon={<BarChart2 size={18} color="var(--color-primary)" />} />
            <StatCard value={pendingMgrs.filter(m => m.pending > 0).length} label="Managers with pending" icon={<AlertTriangle size={18} color="#D97706" />} />
          </div>
        </div>

        {/* Completion Trend Chart */}
        <div style={{ marginTop: 'var(--space-4)' }}>
          <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--color-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Completion trend (6 months)
          </div>
          <GrowthAreaChart data={completionTrend.ashoka} dataKey="rate" height={120} />
        </div>
      </div>

      <div className="hr-grid">
        {/* ── Department Breakdown ── */}
        <div className="card card-pad fade-in">
          <div className="hr-card-header">
            <h3 className="hr-card-title">Department Progress</h3>
            <span className="hr-card-sub">July 2024</span>
          </div>
          <div className="dept-list">
            {deptData.map(dept => (
              <div key={dept.name} className="dept-item">
                <div className="dept-info">
                  <div>
                    <div className="dept-name">{dept.name}</div>
                    {dept.members && <div className="dept-count">{dept.members} member{dept.members !== 1 ? 's' : ''}</div>}
                  </div>
                  <div className="dept-meta">
                    {dept.avgScore && <span className="dept-avg">avg {dept.avgScore}/5</span>}
                    <span className="dept-pct">{dept.progress}%</span>
                  </div>
                </div>
                <ProgressBar value={dept.progress} max={100} size="md" />
                {dept.progress < 80 && (
                  <div className="dept-actions">
                    <button className="dept-nudge-btn" onClick={() => {}}>
                      <Bell size={10} style={{ display: 'inline', marginRight: 2 }} /> Nudge manager
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Manager Accountability ── */}
        <div className="card card-pad fade-in">
          <div className="hr-card-header">
            <h3 className="hr-card-title">Manager Accountability</h3>
            <span className="hr-card-sub" style={{ color: pendingMgrs.some(m => m.overdue > 0) ? 'var(--color-danger)' : 'var(--color-muted)' }}>
              {pendingMgrs.some(m => m.overdue > 0) ? `${overdueCount} overdue` : 'All managers on track'}
            </span>
          </div>
          {pendingMgrs.length === 0 ? (
            <div className="hr-empty">✓ All managers have completed their reviews this month.</div>
          ) : (
            <div className="manager-pending-list">
              {pendingMgrs.map(m => (
                <div key={m.managerId} className="manager-pending-item">
                  <Avatar name={m.name} size="md" />
                  <div className="manager-pending-info">
                    <div className="manager-pending-name">{m.name}</div>
                    <div className="manager-pending-dept">{m.dept}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    {m.overdue > 0 && (
                      <span className="pending-badge overdue-badge">
                        {m.overdue} overdue
                      </span>
                    )}
                    {m.pending > 0 && (
                      <span className="pending-badge">{m.pending} pending</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNudge(m.managerId)}
                      disabled={nudgedManagers[m.managerId]}
                    >
                      {nudgedManagers[m.managerId] ? '✓ Nudged' : <><Bell size={11} style={{ marginRight: 3 }} /> Nudge</>}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button variant="ghost" size="sm" fullWidth style={{ marginTop: 16 }} onClick={() => navigate('/organization')}>
            View full org chart →
          </Button>
        </div>

        {/* ── Top Performers ── */}
        <div className="card card-pad fade-in">
          <div className="hr-card-header">
            <h3 className="hr-card-title">Top Performers</h3>
            <span className="hr-card-sub">July 2024</span>
          </div>
          <div className="top-performers-list">
            {TOP_PERFORMERS.map(p => (
              <div key={p.name} className="top-performer-item">
                <span className={`top-performer-rank ${p.rank === 1 ? 'gold' : ''}`}>
                  {p.rank === 1 ? '🥇' : p.rank === 2 ? '🥈' : '🥉'}
                </span>
                <Avatar name={p.name} size="md" />
                <div className="top-performer-info">
                  <div className="top-performer-name">{p.name}</div>
                  <div className="top-performer-title">{p.title} · {p.dept}</div>
                </div>
                <div style={{ display: 'flex', flex: 'direction: column', alignItems: 'flex-end', gap: 4 }}>
                  <div className="top-performer-score">{p.score}</div>
                  <div className={`top-performer-trend trend-${p.trend}`}>
                    {p.trend === 'up' ? '↑' : p.trend === 'down' ? '↓' : '→'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Score Distribution ── */}
        <div className="card card-pad fade-in">
          <div className="hr-card-header">
            <h3 className="hr-card-title">Score Distribution</h3>
            <span className="hr-card-sub">All employees this month</span>
          </div>
          {SCORE_BANDS.map(band => (
            <div key={band.label} className="score-band-row">
              <span className="score-band-label">{band.label}</span>
              <div className="score-band-bar">
                <ProgressBar value={band.pct} max={100} size="sm" />
              </div>
              <span className={`score-band-pct ${band.cls}`}>{band.pct}%</span>
            </div>
          ))}
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--color-muted)', marginTop: 12 }}>
            20% of employees are below 3.5 — consider targeted coaching conversations.
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card card-pad fade-in">
        <div className="hr-card-header">
          <h3 className="hr-card-title">Recent Activity</h3>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <div className="hr-activity-list">
          {RECENT_ACTS.map((act, i) => (
            <div key={i} className="hr-activity-item">
              <div className={`hr-activity-dot ${act.type}`} />
              <div>
                <div className="hr-activity-text">
                  {act.type === 'submitted' && <><strong>{act.actor}</strong> submitted review for {act.subject}</>}
                  {act.type === 'overdue' && <><strong>{act.subject}</strong>'s review is now overdue</>}
                  {act.type === 'draft' && <><strong>{act.actor}</strong> saved a draft for {act.subject}</>}
                </div>
                <div className="hr-activity-time">{act.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}

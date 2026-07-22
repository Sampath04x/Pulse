// pages/HRDashboard.jsx
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getHRDashboard } from '../services/hrService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { TrendLineChart } from '../components/charts/TrendLineChart';
import { Users, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import './HRDashboard.css';

export default function HRDashboard() {
  const { currentCompany } = useApp();

  const { data, loading } = useAsync(
    () => getHRDashboard(currentCompany?.id || 'ashoka'),
    [currentCompany?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const { stats = {}, managersPending = [], deptProgress = [], trend = [] } = data || {};

  return (
    <PageLayout
      title={`July Health — ${currentCompany?.name || 'Sowaka'}`}
      subtitle="Overview of company-wide growth conversations"
    >
      {/* Health Banner */}
      <div className="hr-health-banner card card-pad fade-in">
        <div className="hr-health-left">
          <div className="hr-health-title">July Health Bar</div>
          <div className="hr-health-pct">{stats.completionRate || 0}%</div>
          <ProgressBar value={stats.completionRate || 0} size="lg" />
          <div className="hr-health-sub">
            {stats.completed || 0} completed · {stats.pending || 0} pending · {stats.overdue || 0} overdue
          </div>
        </div>
        <div className="hr-health-stats">
          <StatCard value={stats.total || 0} label="Team Members" icon={<Users size={20} color="var(--color-primary)" />} />
          <StatCard value={stats.completed || 0} label="Conversations Done" icon={<CheckCircle2 size={20} color="#16A34A" />} />
          <StatCard value={stats.waitingManagers || 0} label="Managers Waiting" icon={<Clock size={20} color="#F59E0B" />} />
        </div>
      </div>

      <div className="hr-grid">
        {/* Department Progress */}
        <div className="card card-pad fade-in">
          <div className="hr-card-header">
            <h3 className="hr-card-title">Progress by Department</h3>
            <span className="hr-card-sub">July 2024</span>
          </div>
          <div className="dept-list">
            {deptProgress.map(d => (
              <div key={d.name} className="dept-item">
                <div className="dept-info">
                  <span className="dept-name">{d.name}</span>
                  <span className="dept-pct">{d.progress}%</span>
                </div>
                <ProgressBar value={d.progress} size="md" />
              </div>
            ))}
          </div>
        </div>

        {/* Pending by Manager */}
        <div className="card card-pad fade-in">
          <div className="hr-card-header">
            <h3 className="hr-card-title">Pending by Growth Lead</h3>
            <span className="hr-card-sub">{managersPending.length} waiting</span>
          </div>
          <div className="manager-pending-list">
            {managersPending.length === 0 ? (
              <div className="hr-empty flex items-center justify-center gap-2">
                <Sparkles size={16} color="var(--color-primary)" />
                <span>All growth leads have completed their conversations!</span>
              </div>
            ) : (
              managersPending.map(({ manager, pendingCount }) => (
                <div key={manager.id} className="manager-pending-item">
                  <Avatar name={manager.name} size="md" />
                  <div className="manager-pending-info">
                    <div className="manager-pending-name">{manager.name}</div>
                    <div className="manager-pending-dept">{manager.departmentId}</div>
                  </div>
                  <span className="pending-badge">{pendingCount} pending</span>
                  <Button variant="ghost" size="sm">Nudge</Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Completion Trend Chart */}
      <div className="card card-pad fade-in" style={{ marginTop: 'var(--space-6)' }}>
        <div className="hr-card-header">
          <h3 className="hr-card-title">6-Month Completion Trend</h3>
          <span className="hr-card-sub">Company-wide completion rate %</span>
        </div>
        <TrendLineChart data={trend} dataKey="rate" height={200} />
      </div>
    </PageLayout>
  );
}

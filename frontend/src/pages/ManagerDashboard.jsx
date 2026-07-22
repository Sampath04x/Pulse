// pages/ManagerDashboard.jsx
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getManagerDashboard } from '../services/managerService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Clock, TrendingUp, Star, Calendar, Lightbulb, MessageSquare } from 'lucide-react';
import './ManagerDashboard.css';

const PRIORITY_CTX = {
  draft:     { label: 'Draft Saved',   btn: 'Continue →', color: '#F59E0B' },
  pending:   { label: 'Due Today',     btn: 'Start →',    color: '#EF4444' },
  submitted: { label: 'Shared',        btn: 'View',       color: '#2F7D5A' },
  locked:    { label: 'Complete',      btn: 'View',       color: '#16A34A' },
};

const MOTIVATIONAL = [
  'Rahul completed an important client delivery this month. Great time to recognize that.',
  'Sneha has been leading design reviews independently. Acknowledge it.',
  "Arjun's code reviews have improved this sprint. A specific mention will encourage him.",
];

export default function ManagerDashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const { data, loading } = useAsync(
    () => getManagerDashboard(currentUser?.id),
    [currentUser?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const { priorities = [], stats = {}, insights } = data || {};
  const firstName = currentUser?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dueSoon = priorities.filter(p => ['draft', 'pending'].includes(p.status));

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <div className="mgr-hero fade-in">
        <div className="mgr-hero-left">
          <h1 className="mgr-greeting">{greeting}, {firstName}</h1>
          <p className="mgr-sub">Your feedback shapes careers.</p>
          {dueSoon.length > 0 && (
            <div className="mgr-cta">
              <span className="mgr-cta-text">{dueSoon.length} conversation{dueSoon.length > 1 ? 's' : ''} need{dueSoon.length === 1 ? 's' : ''} your attention today.</span>
              <Button variant="primary" size="sm" onClick={() => navigate(`/feedback/ev1`)}>
                Start →
              </Button>
            </div>
          )}
        </div>
        {/* Stat bar */}
        <div className="mgr-stats">
          <StatCard value={stats.dueSoon || 0}  label="Due this week"  icon={<ClipboardList size={20} color="var(--color-primary)" />} />
          <StatCard value={stats.overdue || 0}  label="Overdue"        icon={<Clock size={20} color="#EF4444" />} trendDir="down" />
          <StatCard value={`${stats.teamProgress || 0}%`} label="Team progress" icon={<TrendingUp size={20} color="var(--color-primary)" />} />
          <StatCard value={`${stats.avgScore || '—'}/5`}  label="Avg growth score" icon={<Star size={20} color="#F59E0B" />} />
        </div>
      </div>

      <div className="mgr-body">
        {/* ── Left: Priorities ── */}
        <div className="mgr-main">
          <div className="mgr-section-title">Today's Priorities</div>
          <div className="mgr-priorities">
            {priorities.length === 0
              ? <div className="empty-card">All conversations are complete. Your team is growing.</div>
              : priorities.map(({ member, status, progress }, idx) => {
                  const ctx = PRIORITY_CTX[status] || PRIORITY_CTX.pending;
                  const isLocked = ['submitted','locked'].includes(status);
                  return (
                    <div key={member.id} className="priority-card card card-pad fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                      <div className="priority-top">
                        <Avatar name={member.name} size="lg" />
                        <div className="priority-info">
                          <div className="priority-name">{member.name}</div>
                          <div className="priority-title">{member.title}</div>
                          <Badge status={status} label={ctx.label} />
                        </div>
                        <Button
                          variant={isLocked ? 'ghost' : 'primary'}
                          size="sm"
                          onClick={() => navigate(isLocked ? `/team` : `/feedback/ev${idx+1}`)}
                        >
                          {ctx.btn}
                        </Button>
                      </div>
                      {!isLocked && MOTIVATIONAL[idx] && (
                        <p className="priority-hint">{MOTIVATIONAL[idx]}</p>
                      )}
                      {status === 'draft' && progress > 0 && (
                        <div className="priority-progress">
                          <ProgressBar value={progress} />
                          <span className="priority-progress-label">{progress}% complete</span>
                        </div>
                      )}
                    </div>
                  );
                })
            }
          </div>
        </div>

        {/* ── Right: Sidebar Widgets ── */}
        <div className="mgr-sidebar-col">
          {/* Upcoming */}
          <div className="card card-pad fade-in">
            <div className="widget-title flex items-center gap-2">
              <Calendar size={16} color="var(--color-primary)" />
              <span>Upcoming</span>
            </div>
            <div className="widget-body">
              <div className="upcoming-month">July check-ins</div>
              <div className="upcoming-range">Jul 1 – Jul 31</div>
              <div className="upcoming-items">
                {[
                  { day: 'Tomorrow',  name: 'Sneha Iyer' },
                  { day: 'Friday',    name: 'Rahul Verma' },
                  { day: 'Next week', name: 'Arjun Mehta' },
                ].map(u => (
                  <div key={u.name} className="upcoming-item">
                    <span className="upcoming-dot" />
                    <span className="upcoming-day">{u.day}</span>
                    <span className="upcoming-name">{u.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Growth Highlights */}
          <div className="card card-pad fade-in">
            <div className="widget-title flex items-center gap-2">
              <TrendingUp size={16} color="var(--color-primary)" />
              <span>Growth Highlights</span>
            </div>
            <div className="widget-body">
              {[
                { label: 'Communication', dir: 'up' },
                { label: 'Quality of Work', dir: 'up' },
                { label: 'Collaboration',   dir: 'down' },
              ].map(h => (
                <div key={h.label} className="highlight-item">
                  <span className="highlight-label">{h.label}</span>
                  <span className={`highlight-trend ${h.dir === 'up' ? 'up' : 'down'}`}>
                    {h.dir === 'up' ? '↑' : '↓'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Manager Insights */}
          {insights && (
            <div className="card card-pad insights-card fade-in">
              <div className="widget-title flex items-center gap-2">
                <Lightbulb size={16} color="var(--color-primary)" />
                <span>Your Feedback Habits</span>
              </div>
              <div className="insights-sub">This month</div>
              <div className="insights-items">
                <div className="insights-row">
                  <span className="insights-pct">{insights.completionRate}%</span>
                  <span>of conversations completed on time</span>
                </div>
                <div className="insights-row">
                  <span className="insights-pct">{insights.avgWordCount}</span>
                  <span>average words per conversation</span>
                </div>
                <div className="insights-row">
                  <span className="insights-pct">{insights.reviewsWithActionable}/{insights.totalReviews}</span>
                  <span>included actionable suggestions</span>
                </div>
                {insights.reviewsNeedingDetail > 0 && (
                  <div className="insights-warn flex items-center gap-2">
                    <MessageSquare size={14} />
                    <span>{insights.reviewsNeedingDetail} conversation{insights.reviewsNeedingDetail > 1 ? 's' : ''} could be more specific.</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

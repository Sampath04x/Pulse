// pages/ManagerDashboard.jsx
import { useState } from 'react';
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
import {
  ClipboardList, Clock, TrendingUp, Star, Calendar,
  Lightbulb, MessageSquare, AlertCircle, CheckCircle2,
  Users, ArrowRight, ChevronRight, Zap, PenLine, Bell
} from 'lucide-react';
import {
  activityFeed, getLatestEval, getUserById,
  growthHistory, selfReflections
} from '../data/mockData';
import './ManagerDashboard.css';

const STATUS_META = {
  draft:     { label: 'Draft Saved',   btn: 'Continue',    color: '#F59E0B', urgency: 2 },
  pending:   { label: 'Not Started',   btn: 'Start Now',   color: '#EF4444', urgency: 3 },
  overdue:   { label: 'Overdue',       btn: 'Start Now',   color: '#EF4444', urgency: 4 },
  submitted: { label: 'Submitted',     btn: 'View',        color: '#2F7D5A', urgency: 0 },
  locked:    { label: 'Complete',      btn: 'View',        color: '#16A34A', urgency: 0 },
};

const COACHING_HINTS = {
  'u4': "Rahul submitted his self-reflection. He highlighted ownership of the mobile library — great context for your review.",
  'u5': "Arjun's code reviews improved significantly this sprint. A specific acknowledgment will go a long way.",
  'u8': "Ananya's review is overdue. Reach out to schedule a quick 15-minute check-in to write the review together.",
  'u7': "Sampath has been consistently improving. This is a good month to set a stretch goal in his review.",
};

const TREND_MAP = {
  'u4': { dir: 'up', val: '+0.2', score: 4.0 },
  'u5': { dir: 'stable', val: 'Stable', score: 3.8 },
  'u7': { dir: 'up', val: '+0.4', score: 4.4 },
  'u8': { dir: 'down', val: '-0.2', score: 3.6 },
  'u3': { dir: 'up', val: '+0.5', score: 4.8 },
};

export default function ManagerDashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const { data, loading } = useAsync(
    () => getManagerDashboard(currentUser?.id),
    [currentUser?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const { priorities = [], stats = {}, insights } = data || {};
  const firstName = currentUser?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Sort priorities: overdue first, then pending, then draft, then submitted
  const sortedPriorities = [...priorities].sort((a, b) => {
    const aU = STATUS_META[a.status]?.urgency ?? 0;
    const bU = STATUS_META[b.status]?.urgency ?? 0;
    return bU - aU;
  });

  const filtered = filter === 'all'
    ? sortedPriorities
    : sortedPriorities.filter(p => p.status === filter || (filter === 'overdue' && p.status === 'overdue'));

  const overdueCount = priorities.filter(p => p.status === 'overdue').length;
  const draftCount   = priorities.filter(p => p.status === 'draft').length;
  const pendingCount = priorities.filter(p => p.status === 'pending').length;
  const doneCount    = priorities.filter(p => ['submitted','locked'].includes(p.status)).length;

  const myFeed = activityFeed[currentUser?.id] || activityFeed['u3'] || [];

  // Key insight: first pending/draft item
  const topUrgent = sortedPriorities.find(p => ['pending','draft','overdue'].includes(p.status));

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <div className="mgr-hero">
        <div className="mgr-hero-top fade-in">
          <div>
            <h1 className="mgr-greeting">{greeting}, {firstName}</h1>
            <p className="mgr-sub">Your feedback shapes careers. Here's what needs your attention today.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/organization')}>
            <Users size={14} style={{ marginRight: 4 }} /> View Org Chart
          </Button>
        </div>

        {/* Urgent CTA */}
        {overdueCount > 0 && (
          <div className="mgr-cta-banner urgent fade-in">
            <div className="mgr-cta-text">
              <AlertCircle size={16} color="var(--color-danger)" />
              <span>
                <strong>{overdueCount} review{overdueCount > 1 ? 's are' : ' is'} overdue.</strong> Team members are waiting for their feedback.
              </span>
            </div>
            <Button variant="primary" size="sm" style={{ background: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
              onClick={() => setFilter('overdue')}>
              View Overdue →
            </Button>
          </div>
        )}
        {!overdueCount && (draftCount + pendingCount) > 0 && (
          <div className="mgr-cta-banner normal fade-in">
            <div className="mgr-cta-text">
              <Clock size={16} color="#D97706" />
              <span>
                {topUrgent && (<><strong>{topUrgent?.member?.name}'s</strong> review is due {new Date(topUrgent?.dueDate || Date.now()).getDate() <= new Date().getDate() + 2 ? 'soon' : 'this month'}. </>)}
                {draftCount + pendingCount} conversation{(draftCount + pendingCount) > 1 ? 's' : ''} pending.
              </span>
            </div>
            <Button variant="primary" size="sm"
              onClick={() => navigate(`/feedback/${topUrgent ? (topUrgent.evalId || 'ev1') : 'ev1'}`)}>
              {draftCount > 0 ? 'Continue Draft →' : 'Start Review →'}
            </Button>
          </div>
        )}
        {!overdueCount && draftCount === 0 && pendingCount === 0 && doneCount > 0 && (
          <div className="mgr-cta-banner fade-in" style={{ background: 'var(--color-success-lt)', border: '1px solid var(--color-success)' }}>
            <div className="mgr-cta-text">
              <CheckCircle2 size={16} color="var(--color-success)" />
              <span>All {doneCount} conversations complete this month. Excellent work as a people leader.</span>
            </div>
          </div>
        )}

        {/* Stat bar */}
        <div className="mgr-stats fade-in">
          <StatCard value={pendingCount + draftCount} label="Pending reviews"  icon={<ClipboardList size={20} color="var(--color-primary)" />} />
          <StatCard value={overdueCount}              label="Overdue"          icon={<Clock size={20} color="var(--color-danger)" />} trendDir={overdueCount > 0 ? 'down' : 'up'} />
          <StatCard value={`${stats.teamProgress || Math.round((doneCount / (priorities.length || 1)) * 100)}%`} label="Team progress" icon={<TrendingUp size={20} color="var(--color-primary)" />} />
          <StatCard value={`${stats.avgScore || '4.1'}/5`} label="Avg team score" icon={<Star size={20} color="#F59E0B" />} />
        </div>
      </div>

      <div className="mgr-body">
        {/* ── Left: Priority List ── */}
        <div className="mgr-main">
          <div className="mgr-section-header">
            <h3 className="mgr-section-title">Team Reviews · July 2024</h3>
            <span className="mgr-section-count">{doneCount}/{priorities.length} complete</span>
          </div>

          {/* Filter tabs */}
          <div className="mgr-filter-tabs">
            <button className={`mgr-filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All ({priorities.length})
            </button>
            {(overdueCount > 0) && (
              <button className={`mgr-filter-tab danger-tab ${filter === 'overdue' ? 'active' : ''}`} onClick={() => setFilter('overdue')}>
                Overdue ({overdueCount})
              </button>
            )}
            <button className={`mgr-filter-tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
              Not Started ({pendingCount})
            </button>
            <button className={`mgr-filter-tab ${filter === 'draft' ? 'active' : ''}`} onClick={() => setFilter('draft')}>
              In Draft ({draftCount})
            </button>
            <button className={`mgr-filter-tab ${filter === 'submitted' ? 'active' : ''}`} onClick={() => setFilter('submitted')}>
              Done ({doneCount})
            </button>
          </div>

          <div className="mgr-priorities">
            {filtered.length === 0 ? (
              <div className="empty-card">
                <div className="empty-card-title">Nothing here</div>
                <div>No reviews match this filter. Switch to "All" to see the full team.</div>
              </div>
            ) : (
              filtered.map(({ member, status, progress, dueDate, evalId }, idx) => {
                const ctx = STATUS_META[status] || STATUS_META.pending;
                const isLocked = ['submitted', 'locked'].includes(status);
                const isOverdue = status === 'overdue';
                const trend = TREND_MAP[member.id] || { dir: 'stable', val: 'No data', score: 0 };
                const hint = COACHING_HINTS[member.id];
                const hasSelfReflection = !!selfReflections[member.id];

                return (
                  <div
                    key={member.id}
                    className="priority-card card card-pad fade-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="priority-top">
                      <Avatar name={member.name} size="lg" />
                      <div className="priority-info">
                        <div className="priority-name">{member.name}</div>
                        <div className="priority-meta">
                          <span className="priority-title">{member.title}</span>
                          <span className="priority-dept">· {member.departmentId}</span>
                          {member.isNewJoiner && (
                            <span className="priority-join">🌱 New joiner</span>
                          )}
                        </div>
                        <div className="priority-score-row">
                          {trend.score > 0 && (
                            <>
                              <span className="priority-score-label">Last score:</span>
                              <span className="priority-score-val">{trend.score}/5</span>
                              <span className={`priority-trend-badge trend-${trend.dir}`}>
                                {trend.dir === 'up' ? '↑' : trend.dir === 'down' ? '↓' : '→'} {trend.val}
                              </span>
                            </>
                          )}
                          {isOverdue && (
                            <span className="overdue-pill">
                              <AlertCircle size={10} /> Overdue
                            </span>
                          )}
                          {hasSelfReflection && !isLocked && (
                            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-primary)', fontWeight: 600 }}>
                              📝 Self-reflection ready
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant={isLocked ? 'ghost' : 'primary'}
                        size="sm"
                        style={isOverdue ? { background: 'var(--color-danger)', borderColor: 'var(--color-danger)' } : {}}
                        onClick={() => navigate(isLocked ? `/team` : `/feedback/${evalId || 'ev1'}`)}
                      >
                        {ctx.btn} <ChevronRight size={12} />
                      </Button>
                    </div>

                    {/* Progress for drafts */}
                    {status === 'draft' && progress > 0 && (
                      <div className="priority-progress">
                        <ProgressBar value={progress} />
                        <span className="priority-progress-label">{progress}% of review complete</span>
                      </div>
                    )}

                    {/* Coaching hint */}
                    {hint && !isLocked && (
                      <p className="priority-hint">
                        <Lightbulb size={13} style={{ display: 'inline', marginRight: 4 }} />
                        {hint}
                      </p>
                    )}

                    {/* Quick actions for non-complete */}
                    {!isLocked && (
                      <div className="priority-actions">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/feedback/${evalId || 'ev1'}`)}
                        >
                          <PenLine size={13} style={{ marginRight: 4 }} />
                          {status === 'draft' ? 'Continue Draft' : 'Write Review'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Bell size={13} style={{ marginRight: 4 }} /> Nudge
                        </Button>
                      </div>
                    )}

                    {/* View actions for completed */}
                    {isLocked && (
                      <div className="priority-actions">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/team')}>
                          View full review <ArrowRight size={12} />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right: Sidebar ── */}
        <div className="mgr-sidebar-col">

          {/* Schedule / Upcoming */}
          <div className="card card-pad fade-in">
            <div className="widget-title flex items-center gap-2">
              <Calendar size={15} color="var(--color-primary)" />
              <span>This Month's Schedule</span>
            </div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-muted)', marginBottom: 10 }}>
              July 2024 · Cycle closes Jul 31
            </div>
            <div className="widget-body">
              {[
                { day: 'Today',     name: 'Rahul Verma',   status: 'draft' },
                { day: 'Tomorrow',  name: 'Arjun Mehta',   status: 'pending' },
                { day: 'Jul 30',    name: 'Ananya Rao',    status: 'overdue' },
              ].map(u => (
                <div key={u.name} className="upcoming-item">
                  <span className="upcoming-dot" style={{
                    background: u.status === 'overdue' ? 'var(--color-danger)' :
                                u.status === 'draft' ? '#F59E0B' : 'var(--color-primary)'
                  }} />
                  <span className="upcoming-day">{u.day}</span>
                  <span className="upcoming-name">{u.name}</span>
                </div>
              ))}
              <Button variant="ghost" size="sm" fullWidth style={{ marginTop: 8 }} onClick={() => navigate('/team')}>
                View all team members →
              </Button>
            </div>
          </div>

          {/* Growth Highlights */}
          <div className="card card-pad fade-in">
            <div className="widget-title flex items-center gap-2">
              <TrendingUp size={15} color="var(--color-primary)" />
              <span>Team Growth This Month</span>
            </div>
            <div className="widget-body">
              {[
                { label: 'Communication', dir: 'up', name: 'Sneha Iyer' },
                { label: 'Quality of Work', dir: 'up', name: 'Sampath Kumar' },
                { label: 'Initiative', dir: 'down', name: 'Arjun Mehta — needs coaching' },
              ].map(h => (
                <div key={h.label} className="highlight-item">
                  <div>
                    <div className="highlight-label">{h.label}</div>
                    <div className="highlight-name">{h.name}</div>
                  </div>
                  <span className={`highlight-trend ${h.dir === 'up' ? 'up' : 'down'}`}>
                    {h.dir === 'up' ? '↑' : '↓'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Habits */}
          {insights && (
            <div className="card card-pad insights-card fade-in">
              <div className="widget-title flex items-center gap-2">
                <Lightbulb size={15} color="var(--color-primary)" />
                <span>Your Feedback Quality</span>
              </div>
              <div className="insights-sub">This month</div>
              <div className="insights-items">
                <div className="insights-row">
                  <span className="insights-pct">{insights.completionRate}%</span>
                  <span>conversations on time</span>
                </div>
                <div className="insights-row">
                  <span className="insights-pct">{insights.avgWordCount}</span>
                  <span>avg words per review</span>
                </div>
                <div className="insights-row">
                  <span className="insights-pct">{insights.reviewsWithActionable}/{insights.totalReviews}</span>
                  <span>included coaching suggestions</span>
                </div>
                {insights.reviewsNeedingDetail > 0 && (
                  <div className="insights-warn flex items-center gap-2">
                    <MessageSquare size={12} />
                    <span>{insights.reviewsNeedingDetail} review{insights.reviewsNeedingDetail > 1 ? 's' : ''} could use more specific examples.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {myFeed.length > 0 && (
            <div className="card card-pad fade-in">
              <div className="widget-title flex items-center gap-2">
                <Zap size={15} color="var(--color-primary)" />
                <span>Recent Activity</span>
              </div>
              <div className="activity-feed">
                {myFeed.slice(0, 4).map(item => (
                  <div key={item.id} className="activity-item">
                    <div className={`activity-icon ${item.icon}`}>
                      {item.icon === 'check' && <CheckCircle2 size={13} color="var(--color-success)" />}
                      {item.icon === 'clock' && <Clock size={13} color="#D97706" />}
                      {item.icon === 'star' && <Star size={13} color="var(--color-primary)" />}
                    </div>
                    <div>
                      <div className="activity-text">{item.message}</div>
                      <div className="activity-time">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

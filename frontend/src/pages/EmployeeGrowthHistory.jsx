// pages/EmployeeGrowthHistory.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getGrowthHistory } from '../services/employeeService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { StarRating } from '../components/ui/StarRating';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { GrowthAreaChart } from '../components/charts/GrowthAreaChart';
import { ChevronDown, ChevronUp, CheckCircle2, Target, PenLine, Plus } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { goals as mockGoals, selfReflections, parameters, getUserById } from '../data/mockData';
import './EmployeeGrowthHistory.css';

const PARAM_LABELS = Object.fromEntries(parameters.map(p => [p.id, p.label]));

function TimelineCard({ ev, managerName }) {
  const [expanded, setExpanded] = useState(false);
  const score = ev.overallScore || ev.overall_score;

  return (
    <div className="card card-pad timeline-card fade-in">
      <div className="timeline-month-chip">
        {ev.month} {ev.year}
      </div>

      <div className="timeline-header" onClick={() => setExpanded(e => !e)}>
        <div className="timeline-manager">
          <Avatar name={managerName || 'Growth Lead'} size="md" />
          <div>
            <div className="timeline-manager-name">{managerName || 'Growth Lead'}</div>
            <div className="timeline-date">Monthly growth conversation</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="timeline-score-badge">
            <StarRating value={score || 0} size="sm" />
            <span className="timeline-score-num">{score?.toFixed(1)}</span>
          </div>
          <div className="timeline-expand-btn">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="fade-in">
          <div className="timeline-dimensions-grid">
            {ev.dimensions.map(d => (
              <div key={d.parameterId} className="timeline-dim">
                <div className="timeline-dim-header">
                  <span className="timeline-dim-name">{PARAM_LABELS[d.parameterId] || d.parameterId}</span>
                  <span className="timeline-dim-score">{d.score} / 5</span>
                </div>
                <ProgressBar value={d.score} max={5} size="sm" />
                {d.comment && <p className="timeline-dim-comment">"{d.comment}"</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployeeGrowthHistory() {
  const { currentUser, activeRole } = useApp();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('history');
  const [reflectionState, setReflectionState] = useState({
    wins: '',
    challenges: '',
    focus: '',
    submitted: false,
  });

  const employeeIdParam = searchParams.get('employee_id');
  const isManagerOrHR = activeRole === 'manager' || activeRole === 'hr';
  const targetUserId = isManagerOrHR && employeeIdParam ? employeeIdParam : currentUser?.id;
  const isSelf = targetUserId === currentUser?.id;

  const targetUser = getUserById(targetUserId) || currentUser;

  const { data, loading } = useAsync(
    () => getGrowthHistory(targetUserId || 'u7'),
    [targetUserId]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const { evaluations = [], history = [], manager } = data || {};
  const myGoals = mockGoals[targetUserId] || [];
  const myReflection = selfReflections[targetUserId];

  const totalScore = evaluations.reduce((sum, e) => sum + (e.overallScore || e.overall_score || 0), 0);
  const avgOverall = evaluations.length ? (totalScore / evaluations.length).toFixed(1) : '—';
  const totalConvos = evaluations.length;
  const improvement = evaluations.length >= 2
    ? ((evaluations[0].overallScore || evaluations[0].overall_score || 0) - (evaluations[evaluations.length - 1].overallScore || evaluations[evaluations.length - 1].overall_score || 0)).toFixed(1)
    : null;

  const handleReflectionSubmit = () => {
    setReflectionState(s => ({ ...s, submitted: true }));
  };

  return (
    <PageLayout>
      {/* Page Header */}
      <div className="growth-page-header fade-in">
        <div>
          <h1 className="growth-page-title">{isSelf ? 'My Growth' : `${targetUser?.name}'s Growth`}</h1>
          <p className="growth-page-sub">
            {isSelf 
              ? 'Your coaching conversations, goals, and self-reflections.' 
              : `Coaching conversations, goals, and self-reflections for ${targetUser?.name}.`}
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="card card-pad growth-summary-card fade-in">
        <div className="growth-summary-left">
          <span className="growth-summary-label">Average Score</span>
          <div className="growth-summary-score-row">
            <span className="growth-summary-score">{avgOverall}</span>
            <span className="growth-summary-max">/ 5</span>
          </div>
          <StarRating value={parseFloat(avgOverall) || 0} size="md" />
        </div>
        <div className="growth-summary-stats">
          <div className="growth-stat-divider" />
          <div className="growth-summary-stat">
            <span className="growth-stat-val">{totalConvos}</span>
            <span className="growth-stat-lbl">Conversations</span>
          </div>
          <div className="growth-stat-divider" />
          {improvement !== null && (
            <>
              <div className="growth-summary-stat">
                <span className="growth-stat-val" style={{ color: parseFloat(improvement) > 0 ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                  {parseFloat(improvement) > 0 ? '+' : ''}{improvement}
                </span>
                <span className="growth-stat-lbl">Growth in 6 months</span>
              </div>
              <div className="growth-stat-divider" />
            </>
          )}
          <div className="growth-summary-stat">
            <span className="growth-stat-val">{manager?.name?.split(' ')[0] || 'Sneha'}</span>
            <span className="growth-stat-lbl">Growth Lead</span>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="card card-pad fade-in" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="growth-chart-header">
          <h3 className="growth-chart-title">Score Progression</h3>
          <span className="growth-chart-sub">Monthly average score over time</span>
        </div>
        {history.length > 0
          ? <GrowthAreaChart data={history} dataKey="score" height={200} />
          : <div className="growth-empty">Your chart will appear after your first review.</div>
        }
      </div>

      {/* Tabs */}
      <div className="growth-tabs">
        <button className={`growth-tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
          Conversation History
        </button>
        <button className={`growth-tab ${activeTab === 'goals' ? 'active' : ''}`} onClick={() => setActiveTab('goals')}>
          Growth Goals {myGoals.length > 0 && `(${myGoals.length})`}
        </button>
        <button className={`growth-tab ${activeTab === 'reflection' ? 'active' : ''}`} onClick={() => setActiveTab('reflection')}>
          {(myReflection?.submitted || reflectionState.submitted) ? '✓ ' : ''}Self-Reflection
        </button>
      </div>

      {/* ── Tab: History ── */}
      {activeTab === 'history' && (
        <div className="growth-timeline">
          {evaluations.length === 0 ? (
            <div className="growth-empty">
              🌿 No completed conversations yet. Your history will appear here after your first review.
            </div>
          ) : (
            evaluations.map(ev => (
              <TimelineCard key={ev.id || ev.evaluation_id} ev={ev} managerName={manager?.name || 'Growth Lead'} />
            ))
          )}
        </div>
      )}

      {/* ── Tab: Goals ── */}
      {activeTab === 'goals' && (
        <div className="goals-page-list">
          {myGoals.length === 0 ? (
            <div className="card card-pad growth-empty">
              <Target size={32} color="var(--color-muted)" style={{ marginBottom: 12 }} />
              <div>No goals yet. Add your first growth goal.</div>
              <Button variant="primary" size="sm" style={{ marginTop: 16 }}>
                <Plus size={14} style={{ marginRight: 4 }} /> Add Goal
              </Button>
            </div>
          ) : (
            myGoals.map(g => (
              <div key={g.id} className="goal-page-item">
                <div className="goal-page-header">
                  <div className="goal-page-title">{g.title}</div>
                  <span className={`goal-page-status ${
                    g.status === 'done' ? 'goal-status-done-chip' :
                    g.status === 'in-progress' ? 'goal-status-progress-chip' :
                    'goal-status-upcoming-chip'
                  }`}>
                    {g.status === 'done' ? '✓ Done' : g.status === 'in-progress' ? 'In progress' : 'Upcoming'}
                  </span>
                </div>
                {g.status !== 'done' && (
                  <ProgressBar value={g.progress} max={100} size="md" />
                )}
                <div className="goal-page-meta">
                  <span className="goal-page-cat">🎯 {g.category}</span>
                  <span className="goal-page-due">Due: {g.dueDate}</span>
                  <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: g.status === 'done' ? 'var(--color-success)' : 'var(--color-warning)' }}>
                    {g.progress}% complete
                  </span>
                </div>
              </div>
            ))
          )}
          {myGoals.length > 0 && (
            <Button variant="ghost" size="sm" style={{ alignSelf: 'flex-start' }}>
              <Plus size={14} style={{ marginRight: 4 }} /> Add New Goal
            </Button>
          )}
        </div>
      )}

      {/* ── Tab: Self-Reflection ── */}
      {activeTab === 'reflection' && (
        <div>
          {(myReflection?.submitted || reflectionState.submitted) ? (
            <div className="reflection-submitted-banner">
              <CheckCircle2 size={20} color="var(--color-success)" style={{ flexShrink: 0, marginTop: 2 }} />
              <div className="reflection-submitted-text">
                <h4>Self-reflection submitted</h4>
                <p>
                  {myReflection ? `Submitted ${myReflection.submittedAt}. ` : ''}
                  Your manager will see this when writing your July review.
                </p>
              </div>
            </div>
          ) : null}

          <div className="card card-pad fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <PenLine size={16} color="var(--color-primary)" />
              <h3 style={{ margin: 0, fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--color-text)' }}>
                Monthly Self-Reflection · July 2024
              </h3>
            </div>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-muted)', marginBottom: 'var(--space-5)' }}>
              {isSelf 
                ? 'Share your perspective before your manager writes your review. This helps ground the coaching conversation.'
                : `Perspective shared by ${targetUser?.name} before their monthly review.`}
            </p>

            {(myReflection?.submitted || reflectionState.submitted) ? (
              <div>
                <div className="reflection-section">
                  <div className="reflection-section-title">🏆 Key Wins & Accomplishments</div>
                  <div className="reflection-text">{myReflection?.wins || reflectionState.wins}</div>
                </div>
                <div className="reflection-section" style={{ marginTop: 12 }}>
                  <div className="reflection-section-title">⚡ Challenges & Learnings</div>
                  <div className="reflection-text">{myReflection?.challenges || reflectionState.challenges}</div>
                </div>
                <div className="reflection-section" style={{ marginTop: 12 }}>
                  <div className="reflection-section-title">🎯 Focus for Next Month</div>
                  <div className="reflection-text">{myReflection?.focusNextMonth || reflectionState.focus}</div>
                </div>
              </div>
            ) : !isSelf ? (
              <div className="growth-empty" style={{ padding: '24px 0' }}>
                📝 {targetUser?.name} hasn't submitted a self-reflection for this cycle yet.
              </div>
            ) : (
              <div className="reflection-form">
                <div className="reflection-field">
                  <label>🏆 What were your key wins this month?</label>
                  <p>Think about projects you completed, problems you solved, or moments you're proud of.</p>
                  <textarea
                    className="reflection-textarea"
                    placeholder="e.g. Completed the mobile component library, led the design review for onboarding..."
                    rows={3}
                    value={reflectionState.wins}
                    onChange={e => setReflectionState(s => ({ ...s, wins: e.target.value }))}
                  />
                </div>
                <div className="reflection-field">
                  <label>⚡ What challenged you or what could have gone better?</label>
                  <p>Honest self-reflection helps your manager give you better coaching.</p>
                  <textarea
                    className="reflection-textarea"
                    placeholder="e.g. Still finding it hard to push back on unrealistic timelines..."
                    rows={3}
                    value={reflectionState.challenges}
                    onChange={e => setReflectionState(s => ({ ...s, challenges: e.target.value }))}
                  />
                </div>
                <div className="reflection-field">
                  <label>🎯 What do you want to focus on next month?</label>
                  <p>Tell your manager where you want to grow. This becomes your shared goal.</p>
                  <textarea
                    className="reflection-textarea"
                    placeholder="e.g. Get better at proactive communication. Share progress updates before being asked..."
                    rows={3}
                    value={reflectionState.focus}
                    onChange={e => setReflectionState(s => ({ ...s, focus: e.target.value }))}
                  />
                </div>
                <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                  <Button
                    variant="primary"
                    onClick={handleReflectionSubmit}
                    disabled={!reflectionState.wins.trim() && !reflectionState.challenges.trim()}
                  >
                    Submit Self-Reflection →
                  </Button>
                  <Button variant="ghost">Save draft</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
}

// pages/EmployeeDashboard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getEmployeeDashboard } from '../services/employeeService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { StarRating } from '../components/ui/StarRating';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { GrowthAreaChart } from '../components/charts/GrowthAreaChart';
import { Button } from '../components/ui/Button';
import {
  Sparkles, AlertCircle, CheckCircle2, Target, TrendingUp,
  ChevronRight, Clock, FileText, ArrowUpRight, ArrowDownRight,
  Minus, PenLine, Star
} from 'lucide-react';
import { goals as mockGoals, selfReflections } from '../data/mockData';
import './EmployeeDashboard.css';

const TREND_ICON = { up: <ArrowUpRight size={12} />, down: <ArrowDownRight size={12} />, stable: <Minus size={12} /> };
const TREND_COLOR = { up: 'var(--color-primary)', down: 'var(--color-danger)', stable: 'var(--color-muted)' };

const GOAL_STATUS_CLASS = { done: 'goal-status-done', 'in-progress': 'goal-status-progress', upcoming: 'goal-status-upcoming' };
const GOAL_STATUS_LABEL = { done: '✓ Done', 'in-progress': 'In progress', upcoming: 'Upcoming' };

export default function EmployeeDashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [chartTab, setChartTab] = useState('overall');
  const [reflectionDismissed, setReflectionDismissed] = useState(false);

  const { data, loading } = useAsync(
    () => getEmployeeDashboard(currentUser?.id),
    [currentUser?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const { latest, history, dimensionTrends = [] } = data || {};
  const firstName = currentUser?.name?.split(' ')[0] || 'there';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const overallScore = latest?.overallScore || 0;
  const managerName = latest ? 'Sneha Iyer' : null;

  // Self-reflection state
  const myReflection = selfReflections[currentUser?.id];
  const reflectionPending = !myReflection?.submitted && !reflectionDismissed;

  // Goals
  const myGoals = mockGoals[currentUser?.id] || [];
  const doneGoals = myGoals.filter(g => g.status === 'done').length;

  // Strongest & weakest dimension this month
  const scoredDims = dimensionTrends.filter(d => d.score > 0);
  const strongestDim = scoredDims.length ? scoredDims.reduce((a, b) => a.score > b.score ? a : b, scoredDims[0]) : null;
  const weakestDim  = scoredDims.length ? scoredDims.reduce((a, b) => a.score < b.score ? a : b, scoredDims[0]) : null;

  // Next action logic
  const getNextAction = () => {
    if (reflectionPending) return { label: 'Submit your self-reflection before July 25', cta: 'Open Reflection Form', urgent: true };
    if (!latest) return { label: 'Your first conversation will appear here once your manager submits it', cta: null, urgent: false };
    if (myGoals.some(g => g.status === 'in-progress')) return { label: `You have ${myGoals.filter(g => g.status === 'in-progress').length} goals in progress this month`, cta: 'View Goals', urgent: false };
    return { label: 'Great work! Review your feedback and plan your next growth goals', cta: 'View History', urgent: false };
  };
  const nextAction = getNextAction();

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <div className="emp-hero fade-in">
        <div>
          <h1 className="emp-greeting">{greeting}, {firstName} 👋</h1>
          <p className="emp-sub">Here's your growth for July 2024.</p>
        </div>
        {overallScore > 0 && (
          <div className="emp-hero-score">
            <StarRating value={overallScore} size="lg" />
            <span className="emp-hero-score-val">{overallScore}/5 this month</span>
          </div>
        )}
      </div>

      {/* ── Action Banner ── */}
      {reflectionPending && (
        <div className="emp-action-banner fade-in">
          <div className="emp-action-banner-text">
            <AlertCircle size={18} color="#F59E0B" />
            <div>
              <div className="emp-action-banner-label">Self-reflection due July 25</div>
              <div className="emp-action-banner-sub">Share what you accomplished before your manager writes your review.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm" onClick={() => navigate('/growth')}>
              <PenLine size={14} style={{ marginRight: 4 }} /> Submit Reflection
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setReflectionDismissed(true)}>Dismiss</Button>
          </div>
        </div>
      )}
      {myReflection?.submitted && (
        <div className="emp-action-banner success fade-in">
          <div className="emp-action-banner-text">
            <CheckCircle2 size={18} color="var(--color-success)" />
            <div>
              <div className="emp-action-banner-label">Self-reflection submitted · {myReflection.submittedAt}</div>
              <div className="emp-action-banner-sub">Your manager is working on your July review. You'll see it here when it's ready.</div>
            </div>
          </div>
        </div>
      )}

      <div className="emp-body">
        <div className="emp-main">

          {/* ── This Month's Score ── */}
          <div className="card card-pad fade-in">
            <div className="emp-card-header">
              <div className="emp-card-title">This Month's Score</div>
              <span className="emp-card-period">July 2024</span>
            </div>

            {overallScore > 0 ? (
              <>
                <div className="score-badge-row">
                  <span className="score-big">{overallScore.toFixed(1)}</span>
                  <span className="score-max">/ 5</span>
                  <StarRating value={overallScore} size="md" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <ProgressBar value={overallScore} max={5} size="md" />
                </div>
                {/* Dimension breakdown with trend */}
                {dimensionTrends.map(d => (
                  <div key={d.id} className="dim-compare-row">
                    <span className="dim-compare-name">{d.label}</span>
                    <ProgressBar value={d.score} max={5} size="sm" style={{ flex: 1 }} />
                    <span className="dim-compare-score">{d.score > 0 ? d.score.toFixed(1) : '—'}</span>
                    {d.score > 0 && (
                      <span className="dim-compare-trend" style={{ color: TREND_COLOR[d.trend] }}>
                        {TREND_ICON[d.trend]}
                        {Math.abs(d.diff) > 0 ? ` ${d.diff > 0 ? '+' : ''}${d.diff.toFixed(1)}` : ''}
                      </span>
                    )}
                  </div>
                ))}

                {/* Strength / Focus callout */}
                {strongestDim && weakestDim && (
                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <div style={{ flex: 1, background: 'var(--color-success-lt)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-success)', fontWeight: 600, marginBottom: 2 }}>⭐ Strength</div>
                      <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{strongestDim.label}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-muted)' }}>{strongestDim.score}/5 this month</div>
                    </div>
                    <div style={{ flex: 1, background: 'var(--color-warning-lt)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
                      <div style={{ fontSize: 'var(--font-xs)', color: '#D97706', fontWeight: 600, marginBottom: 2 }}>🎯 Focus Area</div>
                      <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--color-text)' }}>{weakestDim.label}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-muted)' }}>Improve this next month</div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="pending-state">
                <div className="pending-state-icon">⏳</div>
                <div className="pending-state-title">Review in progress</div>
                <div className="pending-state-sub">Your manager is working on your July review. It will appear here when submitted.</div>
              </div>
            )}
          </div>

          {/* ── Growth Chart ── */}
          <div className="card card-pad fade-in">
            <div className="emp-card-header">
              <div className="emp-card-title">Your Growth Journey</div>
              <div className="chart-tabs">
                <button className={`chart-tab ${chartTab === 'overall' ? 'active' : ''}`} onClick={() => setChartTab('overall')}>Overall</button>
                <button className={`chart-tab ${chartTab === '6m' ? 'active' : ''}`} onClick={() => setChartTab('6m')}>6 Months</button>
              </div>
            </div>
            {history && history.length > 0 ? (
              <GrowthAreaChart data={history} dataKey="score" height={200} />
            ) : (
              <div className="emp-empty">Your growth chart will appear after your first conversation.</div>
            )}
            {history && history.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <Button variant="ghost" size="sm" onClick={() => navigate('/growth')}>
                  View full history <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </div>

          {/* ── Next Action ── */}
          <div className="next-action-card fade-in">
            <div className="next-action-label">
              <Target size={12} style={{ marginRight: 4, display: 'inline' }} /> Next Step
            </div>
            <div className="next-action-text">{nextAction.label}</div>
            {nextAction.cta && (
              <Button
                variant={nextAction.urgent ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => navigate(nextAction.cta === 'View History' ? '/growth' : '/growth')}
              >
                {nextAction.cta} →
              </Button>
            )}
          </div>
        </div>

        {/* ── Aside ── */}
        <div className="emp-aside">

          {/* Latest Conversation */}
          {latest ? (
            <div className="card card-pad fade-in">
              <div className="emp-card-header">
                <div className="emp-card-title">Latest Feedback</div>
                <span className="emp-card-period">{latest.month} {latest.year}</span>
              </div>
              <div className="latest-header">
                <Avatar name={managerName || 'Manager'} size="md" />
                <div>
                  <div className="latest-manager">{managerName || 'Your Manager'}</div>
                  <div className="latest-month">Submitted {latest.month} {latest.year}</div>
                </div>
              </div>
              <StarRating value={latest.overallScore || 0} size="md" />
              {latest.dimensions?.filter(d => d.comment)?.slice(0, 2).map(d => (
                <blockquote key={d.parameterId} className="latest-quote">
                  "{d.comment}"
                </blockquote>
              ))}
              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/growth')}>
                  <FileText size={13} style={{ marginRight: 4 }} /> Full history
                </Button>
              </div>
            </div>
          ) : (
            <div className="card card-pad fade-in">
              <div className="emp-card-title" style={{ marginBottom: 12 }}>Latest Feedback</div>
              <div className="pending-state" style={{ padding: '24px 8px' }}>
                <div className="pending-state-icon">📬</div>
                <div className="pending-state-title">No review yet</div>
                <div className="pending-state-sub">Your manager hasn't submitted a review for July yet.</div>
              </div>
            </div>
          )}

          {/* Growth Goals */}
          {myGoals.length > 0 && (
            <div className="card card-pad fade-in">
              <div className="emp-card-header">
                <div className="emp-card-title flex items-center gap-2">
                  <Target size={15} color="var(--color-primary)" />
                  <span>Growth Goals</span>
                </div>
                <span className="emp-card-period">{doneGoals}/{myGoals.length} done</span>
              </div>
              <div className="goals-list">
                {myGoals.slice(0, 4).map(g => (
                  <div key={g.id} className="goal-item">
                    <div className="goal-header">
                      <span className="goal-title">{g.title}</span>
                      <span className={GOAL_STATUS_CLASS[g.status]}>{g.progress}%</span>
                    </div>
                    {g.status !== 'done' && <ProgressBar value={g.progress} max={100} size="sm" />}
                    <div className="goal-meta">
                      <span className="goal-category">{g.category}</span>
                      <span className={`goal-due ${GOAL_STATUS_CLASS[g.status]}`}>{GOAL_STATUS_LABEL[g.status]}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/growth')}>
                  Manage goals →
                </Button>
              </div>
            </div>
          )}

          {/* Recognition */}
          <div className="card card-pad recognition-card fade-in">
            <div className="emp-card-title flex items-center gap-2" style={{ marginBottom: 12 }}>
              <Sparkles size={15} color="var(--color-primary)" />
              <span>Recognition</span>
            </div>
            <div className="recognition-body">
              <StarRating value={5} size="sm" />
              <p className="recognition-quote">
                "Excellent ownership during the client delivery. Stepped up without being asked."
              </p>
              <div className="recognition-from">— Sneha Iyer · June 2024</div>
            </div>
          </div>

          {/* Self-reflection status */}
          {!myReflection?.submitted && (
            <div className="self-reflection-cta fade-in">
              <h4>📝 Monthly Self-Reflection</h4>
              <p>Share your wins and focus areas before your manager writes your review.</p>
              <Button variant="primary" size="sm" onClick={() => navigate('/growth')}>
                Submit Reflection
              </Button>
            </div>
          )}
          {myReflection?.submitted && (
            <div className="card card-pad fade-in">
              <div className="emp-card-title flex items-center gap-2" style={{ marginBottom: 10 }}>
                <PenLine size={14} color="var(--color-primary)" />
                <span>My Self-Reflection</span>
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-muted)', marginBottom: 6 }}>Submitted {myReflection.submittedAt}</div>
              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-text)', fontStyle: 'italic', lineHeight: 1.5 }}>
                "{myReflection.wins.substring(0, 120)}..."
              </p>
              <Button variant="ghost" size="sm" style={{ marginTop: 10 }} onClick={() => navigate('/growth')}>
                View full reflection →
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

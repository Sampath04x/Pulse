// pages/EmployeeDashboard.jsx
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getEmployeeDashboard } from '../services/employeeService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { StarRating } from '../components/ui/StarRating';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { GrowthAreaChart } from '../components/charts/GrowthAreaChart';
import { Sparkles } from 'lucide-react';
import './EmployeeDashboard.css';

const TREND_ICON = { up: '↑', down: '↓', stable: '→' };
const TREND_COLOR = { up: 'var(--color-primary)', down: 'var(--color-danger)', stable: 'var(--color-muted)' };

export default function EmployeeDashboard() {
  const { currentUser } = useApp();

  const { data, loading } = useAsync(
    () => getEmployeeDashboard(currentUser?.id),
    [currentUser?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const { latest, history, dimensionTrends = [] } = data || {};
  const firstName = currentUser?.name?.split(' ')[0] || 'there';
  const manager = latest ? { name: 'Sneha Iyer', initials: 'SI' } : null;
  const overallScore = latest?.overallScore || 0;

  return (
    <PageLayout>
      {/* ── Hero ── */}
      <div className="emp-hero fade-in">
        <div>
          <h1 className="emp-greeting">Hello, {firstName}</h1>
          <p className="emp-sub">Here's your growth journey this month.</p>
        </div>
        {overallScore > 0 && (
          <div className="emp-hero-score">
            <StarRating value={overallScore} size="lg" />
            <span className="emp-hero-score-val">{overallScore}/5 this month</span>
          </div>
        )}
      </div>

      <div className="emp-body">
        <div className="emp-main">
          {/* ── Growth Snapshot ── */}
          <div className="card card-pad fade-in">
            <div className="emp-card-header">
              <div className="emp-card-title">Your Growth Snapshot</div>
              <span className="emp-card-period">This month</span>
            </div>
            {dimensionTrends.length === 0
              ? <div className="emp-empty">No conversations yet this month.</div>
              : <div className="snapshot-grid">
                  {dimensionTrends.map(d => (
                    <div key={d.id} className="snapshot-item">
                      <div className="snapshot-label">{d.label}</div>
                      <div className="snapshot-score-row">
                        <span className="snapshot-score">{d.score > 0 ? d.score.toFixed(1) : '—'}</span>
                        {d.score > 0 && (
                          <span className="snapshot-trend" style={{ color: TREND_COLOR[d.trend] }}>
                            {TREND_ICON[d.trend]} {Math.abs(d.diff) > 0 ? `${d.diff > 0 ? '+' : ''}${(d.diff).toFixed(1)}` : d.trend === 'stable' ? 'Stable' : ''}
                          </span>
                        )}
                      </div>
                      <ProgressBar value={d.score} max={5} size="sm" />
                      <div className="snapshot-trend-label">{d.label_text || d.label}</div>
                    </div>
                  ))}
                </div>
            }
          </div>

          {/* ── Growth Journey Chart ── */}
          <div className="card card-pad fade-in">
            <div className="emp-card-header">
              <div className="emp-card-title">Your Journey</div>
              <span className="emp-card-period">Last 6 months</span>
            </div>
            {history.length > 0
              ? <GrowthAreaChart data={history} dataKey="score" height={200} />
              : <div className="emp-empty">Your journey chart will appear after your first conversation.</div>
            }
          </div>
        </div>

        <div className="emp-aside">
          {/* ── Latest Conversation ── */}
          {latest && (
            <div className="card card-pad fade-in">
              <div className="emp-card-title" style={{ marginBottom: 16 }}>Latest Conversation</div>
              <div className="latest-header">
                <Avatar name={manager?.name || 'Manager'} size="md" />
                <div>
                  <div className="latest-manager">{manager?.name || 'Your Manager'}</div>
                  <div className="latest-month">{latest.month} {latest.year}</div>
                </div>
              </div>
              <StarRating value={latest.overallScore || 0} size="md" />
              {latest.dimensions?.[0]?.comment && (
                <blockquote className="latest-quote">
                  "{latest.dimensions[0].comment}"
                </blockquote>
              )}
            </div>
          )}

          {/* ── Growth Journey Labels ── */}
          <div className="card card-pad fade-in">
            <div className="emp-card-title" style={{ marginBottom: 14 }}>Growth Journey</div>
            <div className="journey-items">
              {dimensionTrends.filter(d => d.score > 0).map(d => (
                <div key={d.id} className="journey-item">
                  <div className="journey-dim-top">
                    <span className="journey-dim-name">{d.label}</span>
                    <StarRating value={d.score} size="sm" />
                  </div>
                  <div className="journey-dim-label"
                    style={{ color: TREND_COLOR[d.trend] }}>
                    {d.trend !== 'stable' && `${d.diff > 0 ? '+' : ''}${d.diff.toFixed(1)}  `}
                    {d.label}
                  </div>
                </div>
              ))}
              {dimensionTrends.filter(d => d.score > 0).length === 0 && (
                <div className="emp-empty">Your first conversation will populate this.</div>
              )}
            </div>
          </div>

          {/* Recognition */}
          <div className="card card-pad recognition-card fade-in">
            <div className="emp-card-title flex items-center gap-2">
              <Sparkles size={16} color="var(--color-primary)" />
              <span>Recognition This Month</span>
            </div>
            <div className="recognition-body">
              <StarRating value={5} size="md" />
              <p className="recognition-quote">
                "Excellent ownership during the client delivery."
              </p>
              <div className="recognition-from">— Rohan Menon</div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

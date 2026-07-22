// pages/EmployeeGrowthHistory.jsx
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getGrowthHistory } from '../services/employeeService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { StarRating } from '../components/ui/StarRating';
import { Avatar } from '../components/ui/Avatar';
import { GrowthAreaChart } from '../components/charts/GrowthAreaChart';
import './EmployeeGrowthHistory.css';

export default function EmployeeGrowthHistory() {
  const { currentUser } = useApp();

  const { data, loading } = useAsync(
    () => getGrowthHistory(currentUser?.id || 'u7'),
    [currentUser?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const { evaluations = [], history = [], manager } = data || {};

  const totalScore = evaluations.reduce((sum, e) => sum + (e.overallScore || 0), 0);
  const avgOverall = evaluations.length ? (totalScore / evaluations.length).toFixed(1) : '4.3';

  return (
    <PageLayout title="My Growth History" subtitle="Your long-term coaching and feedback timeline">
      {/* Header Summary Card */}
      <div className="card card-pad growth-summary-card fade-in">
        <div className="growth-summary-left">
          <span className="growth-summary-label">Overall Average</span>
          <div className="growth-summary-score-row">
            <span className="growth-summary-score">{avgOverall}</span>
            <span className="growth-summary-max">/ 5</span>
          </div>
          <StarRating value={parseFloat(avgOverall)} size="md" />
        </div>
        <div className="growth-summary-right">
          <div className="growth-summary-stat">
            <span className="growth-stat-val">{evaluations.length}</span>
            <span className="growth-stat-lbl">Conversations</span>
          </div>
          <div className="growth-summary-stat">
            <span className="growth-stat-val">{manager ? manager.name.split(' ')[0] : 'Rohan'}</span>
            <span className="growth-stat-lbl">Growth Lead</span>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="card card-pad fade-in" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="growth-chart-header">
          <h3 className="growth-chart-title">Score Progression Over Time</h3>
          <span className="growth-chart-sub">Monthly average score</span>
        </div>
        <GrowthAreaChart data={history} dataKey="score" height={220} />
      </div>

      {/* History Timeline */}
      <div className="growth-timeline fade-in">
        <h3 className="timeline-title">Conversation History</h3>
        <div className="timeline-list">
          {evaluations.length === 0 ? (
            <div className="card card-pad timeline-empty">
              🌿 No locked conversations found yet.
            </div>
          ) : (
            evaluations.map((ev) => (
              <div key={ev.id} className="card card-pad timeline-card">
                <div className="timeline-header">
                  <div className="timeline-manager">
                    <Avatar name={manager?.name || 'Growth Lead'} size="md" />
                    <div>
                      <div className="timeline-manager-name">{manager?.name || 'Growth Lead'}</div>
                      <div className="timeline-date">{ev.month} {ev.year}</div>
                    </div>
                  </div>
                  <div className="timeline-score-badge">
                    <StarRating value={ev.overallScore || 0} size="sm" />
                    <span className="timeline-score-num">{ev.overallScore?.toFixed(1)}</span>
                  </div>
                </div>

                <div className="timeline-dimensions-grid">
                  {ev.dimensions.map((d) => (
                    <div key={d.parameterId} className="timeline-dim">
                      <div className="timeline-dim-header">
                        <span className="timeline-dim-name">{d.parameterId}</span>
                        <span className="timeline-dim-score">{d.score} / 5</span>
                      </div>
                      <p className="timeline-dim-comment">"{d.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}

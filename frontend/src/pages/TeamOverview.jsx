// pages/TeamOverview.jsx
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getTeamOverview } from '../services/managerService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { Avatar } from '../components/ui/Avatar';
import { StarRating } from '../components/ui/StarRating';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';
import './TeamOverview.css';

export default function TeamOverview() {
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const { data, loading } = useAsync(
    () => getTeamOverview(currentUser?.id || 'u3'),
    [currentUser?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const { team = [] } = data || {};

  return (
    <PageLayout title="Team Overview" subtitle="Detailed growth metrics for your direct reports">
      <div className="team-grid">
        {team.length === 0 ? (
          <div className="card card-pad team-empty">
            🌿 No team members assigned yet.
          </div>
        ) : (
          team.map(({ member, latest, overallScore, dimensions }) => (
            <div key={member.id} className="card card-pad team-card fade-in">
              <div className="team-card-header">
                <Avatar name={member.name} size="lg" />
                <div className="team-member-info">
                  <h3 className="team-member-name">{member.name}</h3>
                  <div className="team-member-title">{member.title}</div>
                  <div className="team-member-checkin">
                    Last Check-in: {latest ? `${latest.month} ${latest.year}` : 'None'}
                  </div>
                </div>
                <Badge status="up" label="↑ Improving" />
              </div>

              <div className="team-overall-row">
                <span className="team-overall-label">Growth Rating</span>
                <div className="team-overall-stars">
                  <StarRating value={overallScore} size="sm" />
                  <span className="team-overall-num">{overallScore ? overallScore.toFixed(1) : '—'}</span>
                </div>
              </div>

              {/* Dimension Breakdown */}
              <div className="team-dimensions-list">
                {dimensions.length > 0 ? (
                  dimensions.map((d) => (
                    <div key={d.parameter_id} className="team-dim-row">
                      <span className="team-dim-label" style={{ textTransform: 'capitalize' }}>
                        {d.parameter_id}
                      </span>
                      <div className="team-dim-bar">
                        <ProgressBar value={d.score} max={5} size="sm" />
                      </div>
                      <span className="team-dim-val">{d.score}</span>
                    </div>
                  ))
                ) : (
                  <div className="team-no-dims">No rating parameters yet.</div>
                )}
              </div>

              <div className="team-card-footer">
                <Button variant="ghost" size="sm" fullWidth onClick={() => navigate('/feedback/ev1')}>
                  View Conversation →
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}

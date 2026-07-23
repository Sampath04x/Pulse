// pages/TeamOverview.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { 
  Users, Search, Bell, TrendingUp, Calendar, 
  CheckCircle2, Clock, AlertCircle, FileText, ChevronRight 
} from 'lucide-react';
import { selfReflections, evaluations as allEvaluations, parameters } from '../data/mockData';
import './TeamOverview.css';

const STATUS_CONFIG = {
  locked:    { label: 'Completed',    cls: 'status-locked',    urgency: 0 },
  submitted: { label: 'Submitted',     cls: 'status-submitted', urgency: 0 },
  draft:     { label: 'In Draft',      cls: 'status-draft',     urgency: 2 },
  pending:   { label: 'Not Started',   cls: 'status-pending',   urgency: 1 },
  overdue:   { label: 'Overdue',       cls: 'status-overdue',   urgency: 3 },
};

const PARAM_LABELS = Object.fromEntries(parameters.map(p => [p.id, p.label]));

export default function TeamOverview() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [nudgedMembers, setNudgedMembers] = useState({});

  const { data, loading } = useAsync(
    () => getTeamOverview(currentUser?.id || 'u3'),
    [currentUser?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const { team = [] } = data || {};

  // Find local status from evaluations mockData in case API status is out of sync or simple
  const enrichedTeam = team.map(item => {
    // Look up the evaluation for this user in mockData
    const localEval = allEvaluations.find(e => e.employeeId === item.member.id && e.month === 'July');
    const status = localEval?.status || item.latest?.status || 'pending';
    const evalId = localEval?.id || item.latest?.id || 'ev1';
    const hasReflection = !!selfReflections[item.member.id];
    return {
      ...item,
      status,
      evalId,
      hasReflection,
    };
  });

  // Calculate team stats
  const totalCount = enrichedTeam.length;
  const completedCount = enrichedTeam.filter(t => ['locked', 'submitted'].includes(t.status)).length;
  const draftCount = enrichedTeam.filter(t => t.status === 'draft').length;
  const pendingCount = enrichedTeam.filter(t => t.status === 'pending').length;
  const overdueCount = enrichedTeam.filter(t => t.status === 'overdue').length;

  // Filter team
  const filteredTeam = enrichedTeam.filter(item => {
    const matchesSearch = item.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.member.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'completed') return matchesSearch && ['locked', 'submitted'].includes(item.status);
    return matchesSearch && item.status === statusFilter;
  });

  const handleNudge = (memberId) => {
    setNudgedMembers(prev => ({ ...prev, [memberId]: true }));
  };

  return (
    <PageLayout>
      {/* Header section */}
      <div className="team-page-header fade-in">
        <div>
          <h1 className="team-page-title">Team Growth Hub</h1>
          <p className="team-page-sub">Track active reviews, coaching trends, and growth history for your direct reports.</p>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="team-stats-row fade-in">
        <div className="card card-pad team-stat-box">
          <span className="team-stat-lbl">Total Direct Reports</span>
          <span className="team-stat-val">{totalCount}</span>
        </div>
        <div className="card card-pad team-stat-box">
          <span className="team-stat-lbl">Completed Reviews</span>
          <span className="team-stat-val text-success">{completedCount}</span>
        </div>
        <div className="card card-pad team-stat-box">
          <span className="team-stat-lbl">In Draft</span>
          <span className="team-stat-val text-warning">{draftCount}</span>
        </div>
        <div className="card card-pad team-stat-box">
          <span className="team-stat-lbl">Overdue / Action Needed</span>
          <span className="team-stat-val text-danger">{overdueCount}</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="team-filter-bar card card-pad fade-in">
        <div className="team-search-input-wrapper">
          <Search size={16} className="team-search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="team-search-input"
          />
        </div>
        
        <div className="team-filter-tabs">
          <button 
            className={`team-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({totalCount})
          </button>
          <button 
            className={`team-filter-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({completedCount})
          </button>
          <button 
            className={`team-filter-btn ${statusFilter === 'draft' ? 'active' : ''}`}
            onClick={() => setStatusFilter('draft')}
          >
            In Draft ({draftCount})
          </button>
          <button 
            className={`team-filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Not Started ({pendingCount})
          </button>
          {overdueCount > 0 && (
            <button 
              className={`team-filter-btn danger-tab ${statusFilter === 'overdue' ? 'active' : ''}`}
              onClick={() => setStatusFilter('overdue')}
            >
              Overdue ({overdueCount})
            </button>
          )}
        </div>
      </div>

      {/* Grid of Team Cards */}
      <div className="team-grid">
        {filteredTeam.length === 0 ? (
          <div className="card card-pad team-empty">
            <Users size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 600, color: 'var(--color-text)' }}>No matching reports found</h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-muted)' }}>Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          filteredTeam.map(({ member, overallScore, dimensions, status, evalId, hasReflection }) => {
            const isCompleted = ['locked', 'submitted'].includes(status);
            const isDraft = status === 'draft';
            const isOverdue = status === 'overdue';
            const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

            return (
              <div key={member.id} className={`card card-pad team-card fade-in ${isOverdue ? 'border-danger' : ''}`}>
                
                {/* Header info */}
                <div className="team-card-header">
                  <Avatar name={member.name} size="lg" />
                  <div className="team-member-info">
                    <h3 className="team-member-name">{member.name}</h3>
                    <div className="team-member-title">{member.title}</div>
                    <div className="team-member-checkin flex items-center gap-1">
                      <Clock size={11} />
                      <span>Last Cycle: June 2024</span>
                    </div>
                  </div>
                  <span className={`team-status-chip ${statusConfig.cls}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Score Summary Block */}
                <div className="team-overall-row">
                  <span className="team-overall-label">July Performance Rating</span>
                  <div className="team-overall-stars">
                    {overallScore > 0 ? (
                      <>
                        <StarRating value={overallScore} size="sm" />
                        <span className="team-overall-num">{overallScore.toFixed(1)}</span>
                      </>
                    ) : (
                      <span className="team-no-rating-label">Rating Pending</span>
                    )}
                  </div>
                </div>

                {/* Dimension Breakdown */}
                <div className="team-dimensions-list">
                  {dimensions.length > 0 ? (
                    dimensions.map((d) => (
                      <div key={d.parameter_id} className="team-dim-row">
                        <span className="team-dim-label">
                          {PARAM_LABELS[d.parameter_id] || d.parameter_id}
                        </span>
                        <div className="team-dim-bar">
                          <ProgressBar value={d.score} max={5} size="sm" />
                        </div>
                        <span className="team-dim-val">{d.score > 0 ? d.score : '—'}</span>
                      </div>
                    ))
                  ) : (
                    <div className="team-no-dims">Coaching conversation dimensions not rated yet.</div>
                  )}
                </div>

                {/* Prompts / Self reflection info */}
                {hasReflection && !isCompleted && (
                  <div className="team-reflection-nudge flex items-center justify-between">
                    <span className="flex items-center gap-1 text-primary font-semibold text-xs">
                      <CheckCircle2 size={12} color="var(--color-primary)" />
                      Self-reflection submitted
                    </span>
                    <Button 
                      variant="ghost" 
                      size="xs"
                      onClick={() => navigate(`/growth?employee_id=${member.id}`)}
                    >
                      Read reflection
                    </Button>
                  </div>
                )}
                {!hasReflection && !isCompleted && (
                  <div className="team-reflection-nudge flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted text-xs">
                      <Clock size={12} />
                      Reflection pending
                    </span>
                    <Button 
                      variant="ghost" 
                      size="xs"
                      className="nudge-action-btn"
                      onClick={() => handleNudge(member.id)}
                      disabled={nudgedMembers[member.id]}
                    >
                      {nudgedMembers[member.id] ? '✓ Nudged' : 'Send Nudge'}
                    </Button>
                  </div>
                )}

                {/* Action Footer */}
                <div className="team-card-footer">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => navigate(`/growth?employee_id=${member.id}`)}
                  >
                    View Growth History
                  </Button>
                  
                  {!isCompleted ? (
                    <Button 
                      variant="primary" 
                      size="sm" 
                      style={isOverdue ? { background: 'var(--color-danger)', borderColor: 'var(--color-danger)' } : {}}
                      onClick={() => navigate(`/feedback/${evalId}`)}
                    >
                      {isDraft ? 'Continue Draft' : 'Write Review'}
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/growth?employee_id=${member.id}`)}
                    >
                      View Feedback
                    </Button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </PageLayout>
  );
}

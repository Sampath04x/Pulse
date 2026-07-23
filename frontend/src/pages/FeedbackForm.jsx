// pages/FeedbackForm.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, MessageSquare, Zap, Users, Rocket, Lightbulb, Check, ChevronDown, ChevronUp, ChevronRight, Clock, ArrowLeft, FileText, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getEvaluation, submitEvaluation, saveDraft, parameters } from '../services/evaluationService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { Avatar } from '../components/ui/Avatar';
import { StarRating } from '../components/ui/StarRating';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { FeedbackQualityMeter } from '../components/ui/FeedbackQualityMeter';
import { FeedbackLifecyclePill } from '../components/ui/FeedbackLifecyclePill';
import { CelebrationScreen } from '../components/ui/CelebrationScreen';
import { selfReflections, evaluations as allEvaluations, getUserById } from '../data/mockData';
import './FeedbackForm.css';

const ICON_MAP = { Target, MessageSquare, Zap, Users, Rocket };

// Helper to count words
function wordCount(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

// Estimated reading time
function getEstimatedTime(completedCount, total) {
  const remaining = total - completedCount;
  return remaining === 0 ? 'Done!' : `~${remaining * 3} min remaining`;
}

export default function FeedbackForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const { data: initialEval, loading } = useAsync(() => getEvaluation(id || 'ev1'), [id]);
  const [dimensions, setDimensions]       = useState([]);
  const [openIndex, setOpenIndex]         = useState(0);
  const [saving, setSaving]               = useState(false);
  const [lastSaved, setLastSaved]         = useState(null);
  const [submitting, setSubmitting]       = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showReviewSummary, setShowReviewSummary] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  useEffect(() => {
    if (initialEval) {
      if (initialEval.dimensions && initialEval.dimensions.length > 0) {
        setDimensions(initialEval.dimensions);
      } else {
        setDimensions(parameters.map(p => ({ parameterId: p.id, score: 0, comment: '' })));
      }
    }
  }, [initialEval]);

  // Auto-save every 30s
  useEffect(() => {
    if (!initialEval || dimensions.length === 0) return;
    const timer = setTimeout(async () => {
      try {
        await saveDraft(initialEval.id, dimensions);
        setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch {}
    }, 3000);
    return () => clearTimeout(timer);
  }, [dimensions, initialEval]);

  if (loading || !initialEval) return <PageLayout><SkeletonPage /></PageLayout>;

  const employee = initialEval.employee;

  // Get previous month's evaluation for reference
  const prevEval = allEvaluations.find(e =>
    e.employeeId === employee?.id &&
    e.status === 'locked' &&
    e.id !== initialEval.id
  );

  // Self-reflection from this employee
  const reflection = selfReflections[employee?.id];

  const handleScoreChange = (paramId, newScore) => {
    setDimensions(prev => prev.map(d => d.parameterId === paramId ? { ...d, score: newScore } : d));
  };

  const handleCommentChange = (paramId, newComment) => {
    setDimensions(prev => prev.map(d => d.parameterId === paramId ? { ...d, comment: newComment } : d));
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    await saveDraft(initialEval.id, dimensions);
    setSaving(false);
    setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitEvaluation(initialEval.id, dimensions);
    setSubmitting(false);
    setShowCelebration(true);
  };

  const completedCount = dimensions.filter(d => d.score > 0 && d.comment.trim().length > 10).length;
  const totalScore = completedCount > 0
    ? (dimensions.filter(d => d.score > 0).reduce((s, d) => s + d.score, 0) / dimensions.filter(d => d.score > 0).length).toFixed(1)
    : null;
  const overallProgress = Math.round((completedCount / parameters.length) * 100);

  const getPrevScore = (paramId) => {
    if (!prevEval) return null;
    const dim = prevEval.dimensions?.find(d => d.parameterId === paramId);
    return dim?.score || null;
  };

  return (
    <PageLayout title="" subtitle="">
      {showCelebration && (
        <CelebrationScreen
          managerName={currentUser?.name?.split(' ')[0] || 'Manager'}
          employeeName={employee?.name || 'Team Member'}
          onBack={() => navigate('/manager')}
          onNext={() => navigate('/manager')}
        />
      )}

      {/* Back navigation */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/manager')}>
          <ArrowLeft size={14} style={{ marginRight: 4 }} /> Back to Dashboard
        </Button>
      </div>

      {/* ── Employee Header ── */}
      <div className="card card-pad form-header-card fade-in" style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div className="form-header-left">
            <Avatar name={employee?.name} size="lg" />
            <div>
              <h2 className="form-employee-name">{employee?.name}</h2>
              <div className="form-employee-title">{employee?.title}</div>
              <div className="form-employee-meta">
                <span className="form-meta-chip">{employee?.departmentId}</span>
                <span className="form-meta-chip">July 2024</span>
                {employee?.joinDate && (
                  <span className="form-meta-chip">Joined {new Date(employee.joinDate).getFullYear()}</span>
                )}
              </div>
            </div>
          </div>
          <div className="form-header-right">
            <FeedbackLifecyclePill status={initialEval.status} />
            <div className="form-progress-text">{completedCount} of {parameters.length} dimensions complete</div>
            {lastSaved && (
              <div className="autosave-indicator">
                <div className="autosave-dot" />
                Saved {lastSaved}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Overall Progress ── */}
      <div className="form-overall-progress fade-in" style={{ marginBottom: 'var(--space-4)' }}>
        <div className="form-progress-pct">{overallProgress}%</div>
        <div className="form-progress-info">
          <div className="form-progress-label">
            {completedCount === 0 ? 'Start the conversation' :
             completedCount < parameters.length ? `${parameters.length - completedCount} dimension${parameters.length - completedCount > 1 ? 's' : ''} remaining` :
             'All dimensions complete — ready to submit!'}
          </div>
          <ProgressBar value={overallProgress} max={100} size="md" />
          <div className="form-time-remaining">
            <Clock size={11} style={{ display: 'inline', marginRight: 4 }} />
            {getEstimatedTime(completedCount, parameters.length)}
            {totalScore && ` · Current average: ${totalScore}/5`}
          </div>
        </div>
      </div>

      <div className="form-layout">
        {/* ── Main: Accordion Dimensions ── */}
        <div className="form-main">
          <div className="form-dimensions fade-in">
            {parameters.map((param, index) => {
              const dimState = dimensions.find(d => d.parameterId === param.id) || { score: 0, comment: '' };
              const isOpen   = openIndex === index;
              const isComplete = dimState.score > 0 && dimState.comment.trim().length > 10;
              const ParamIcon = ICON_MAP[param.iconName] || Target;
              const wc = wordCount(dimState.comment);
              const prevScore = getPrevScore(param.id);

              return (
                <div key={param.id} className={`card dimension-card ${isOpen ? 'open' : ''} ${isComplete && !isOpen ? 'complete' : ''}`}>
                  <div className="dimension-header" onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                    <div className="dimension-header-title">
                      <span className="dim-icon"><ParamIcon size={18} color={isComplete ? 'var(--color-success)' : 'var(--color-primary)'} /></span>
                      <span className="dim-index">{index + 1}.</span>
                      <span className="dim-label">{param.label}</span>
                      {isComplete && <Check size={15} className="dim-check" color="var(--color-success)" />}
                    </div>
                    <div className="dimension-header-right">
                      {dimState.score > 0 && <StarRating value={dimState.score} size="sm" />}
                      {prevScore && !isOpen && (
                        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-muted)' }}>
                          Last: {prevScore}/5
                        </span>
                      )}
                      <span className="dim-toggle">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="dimension-content fade-in">
                      {/* Description */}
                      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--color-muted)', margin: '12px 0', lineHeight: 1.5 }}>
                        {param.description}
                      </p>

                      {/* Score */}
                      <div className="dim-rating-section">
                        <label className="dim-input-label">
                          Rate {employee?.name?.split(' ')[0]}'s {param.label.toLowerCase()} this month
                        </label>
                        <StarRating
                          value={dimState.score}
                          interactive={true}
                          size="lg"
                          onChange={(val) => handleScoreChange(param.id, val)}
                        />
                        {/* Score label */}
                        {dimState.score > 0 && (
                          <div className="score-explanation">
                            {param.scoreLabels[dimState.score - 1]}
                          </div>
                        )}
                        {/* Previous month comparison */}
                        {prevScore && (
                          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-muted)', marginTop: 8 }}>
                            Last month: {prevScore}/5
                            {dimState.score > 0 && (
                              <span style={{
                                marginLeft: 8, fontWeight: 700,
                                color: dimState.score > prevScore ? 'var(--color-success)' : dimState.score < prevScore ? 'var(--color-danger)' : 'var(--color-muted)'
                              }}>
                                {dimState.score > prevScore ? `↑ +${dimState.score - prevScore}` :
                                 dimState.score < prevScore ? `↓ ${dimState.score - prevScore}` : '→ Same'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Comment */}
                      <div className="dim-comment-section">
                        <label className="dim-input-label">
                          Tell {employee?.name?.split(' ')[0]} what you observed
                        </label>
                        <textarea
                          className="dim-textarea"
                          placeholder={`Share a specific example about ${param.label.toLowerCase()}. The more concrete, the more useful it is for ${employee?.name?.split(' ')[0]}...`}
                          rows={4}
                          value={dimState.comment}
                          onChange={(e) => handleCommentChange(param.id, e.target.value)}
                        />
                        <div className="word-count-row">
                          <span className={`word-count ${wc >= 20 ? 'good' : ''}`}>{wc} words {wc < 15 ? '· aim for 20+' : wc >= 30 ? '✓ great detail' : ''}</span>
                        </div>

                        {/* Coaching tip */}
                        <div className="coaching-tip flex items-center gap-2">
                          <Lightbulb size={14} className="tip-icon flex-shrink-0" />
                          <span className="tip-text">{param.tip}</span>
                        </div>

                        {/* Quality meter */}
                        <FeedbackQualityMeter text={dimState.comment} />

                        {/* Example starters */}
                        {dimState.comment.length === 0 && (
                          <div className="examples-section">
                            <div className="examples-title">Example starters (click to use)</div>
                            <div className="example-chips">
                              {param.examples.slice(0, 2).map((ex, i) => (
                                <button
                                  key={i}
                                  className="example-chip"
                                  onClick={() => handleCommentChange(param.id, ex)}
                                >
                                  "{ex}"
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Next button */}
                      <div className="dim-nav-row">
                        {index < parameters.length - 1 ? (
                          <Button
                            variant={isComplete ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setOpenIndex(index + 1)}
                          >
                            Next: {parameters[index + 1].label} <ChevronRight size={13} />
                          </Button>
                        ) : completedCount === parameters.length ? (
                          <Button variant="primary" size="sm" onClick={() => setShowReviewSummary(true)}>
                            Review & Submit <ChevronRight size={13} />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Review Summary Preview ── */}
          {showReviewSummary && completedCount === parameters.length && (
            <div className="card card-pad fade-in" style={{ border: '2px solid var(--color-primary)' }}>
              <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--color-text)', marginBottom: 16 }}>
                Review Summary — {employee?.name}
              </h3>
              <div className="review-summary">
                {parameters.map(p => {
                  const d = dimensions.find(dim => dim.parameterId === p.id);
                  return (
                    <div key={p.id} className="summary-row">
                      <span className="summary-dim-name">{p.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <StarRating value={d?.score || 0} size="sm" />
                        <span className="summary-dim-score">{d?.score || 0}/5</span>
                      </div>
                    </div>
                  );
                })}
                <div className="summary-overall">
                  Overall average: {totalScore}/5
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <Button variant="ghost" size="sm" onClick={() => setShowReviewSummary(false)}>
                  Edit Responses
                </Button>
                <Button variant="primary" onClick={handleSubmit} loading={submitting}>
                  Submit Conversation →
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="form-sidebar">

          {/* Self-Reflection (if submitted) */}
          {reflection?.submitted && (
            <div className="card card-pad fade-in">
              <div className="sidebar-widget-title">
                <FileText size={14} color="var(--color-primary)" />
                {employee?.name?.split(' ')[0]}'s Self-Reflection
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-muted)', marginBottom: 8, marginTop: 4 }}>
                Submitted {reflection.submittedAt}
              </div>
              <div className="self-ref-panel">
                <div className="self-ref-title">🏆 Key wins</div>
                <div className="self-ref-text">"{reflection.wins}"</div>
              </div>
              <div className="self-ref-panel" style={{ marginTop: 8 }}>
                <div className="self-ref-title">🎯 Focus next month</div>
                <div className="self-ref-text">"{reflection.focusNextMonth}"</div>
              </div>
            </div>
          )}

          {/* Previous Month Reference */}
          {prevEval && (
            <div className="card card-pad fade-in">
              <div className="sidebar-widget-title">
                <Star size={14} color="var(--color-primary)" />
                Last Month ({prevEval.month} {prevEval.year})
              </div>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 'var(--font-xs)', fontWeight: 700, color: 'var(--color-muted)', marginBottom: 8 }}>
                  Overall: {prevEval.overallScore}/5
                </div>
                <div>
                  {prevEval.dimensions.map(d => (
                    <div key={d.parameterId} className="prev-score-row">
                      <span className="prev-dim-name" style={{ textTransform: 'capitalize' }}>
                        {d.parameterId}
                      </span>
                      <span className="prev-dim-score">{d.score}/5</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quality Meter for overall */}
          <div className="card card-pad fade-in">
            <div className="sidebar-widget-title">
              <Lightbulb size={14} color="var(--color-primary)" />
              Conversation Depth
            </div>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {parameters.map((p, i) => {
                const d = dimensions.find(dim => dim.parameterId === p.id);
                const wc = wordCount(d?.comment || '');
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-muted)', flex: 1 }}>{p.label}</div>
                    <div style={{ fontSize: 'var(--font-xs)', fontWeight: 600,
                      color: wc >= 20 ? 'var(--color-success)' : wc > 0 ? '#D97706' : 'var(--color-muted)' }}>
                      {wc >= 20 ? '✓ Strong' : wc > 0 ? `${wc}w` : '—'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="form-footer-actions fade-in">
        <div>
          <div className={`form-save-status ${lastSaved ? 'saved' : ''}`}>
            {lastSaved ? `✓ Draft saved at ${lastSaved}` : 'Unsaved changes — auto-saves every few seconds'}
          </div>
          <div style={{ fontSize: 'var(--font-xs)', color: 'var(--color-muted)', marginTop: 2 }}>
            {completedCount}/{parameters.length} dimensions complete
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="ghost" onClick={handleSaveDraft} loading={saving}>
            Save Draft
          </Button>
          <Button
            variant="primary"
            onClick={completedCount === parameters.length ? () => setShowReviewSummary(true) : undefined}
            disabled={completedCount < parameters.length}
            title={completedCount < parameters.length ? `Complete all ${parameters.length} dimensions to submit` : ''}
          >
            {completedCount < parameters.length
              ? `${parameters.length - completedCount} more to complete`
              : 'Review & Share →'}
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

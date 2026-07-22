// pages/FeedbackForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Target, MessageSquare, Zap, Users, Rocket, Lightbulb, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getEvaluation, submitEvaluation, saveDraft, parameters } from '../services/evaluationService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { Avatar } from '../components/ui/Avatar';
import { StarRating } from '../components/ui/StarRating';
import { Button } from '../components/ui/Button';
import { FeedbackQualityMeter } from '../components/ui/FeedbackQualityMeter';
import { FeedbackLifecyclePill } from '../components/ui/FeedbackLifecyclePill';
import { CelebrationScreen } from '../components/ui/CelebrationScreen';
import './FeedbackForm.css';

const ICON_MAP = {
  Target: Target,
  MessageSquare: MessageSquare,
  Zap: Zap,
  Users: Users,
  Rocket: Rocket,
};

export default function FeedbackForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const { data: initialEval, loading } = useAsync(() => getEvaluation(id || 'ev1'), [id]);
  const [dimensions, setDimensions] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (initialEval) {
      if (initialEval.dimensions && initialEval.dimensions.length > 0) {
        setDimensions(initialEval.dimensions);
      } else {
        setDimensions(parameters.map(p => ({ parameterId: p.id, score: 0, comment: '' })));
      }
    }
  }, [initialEval]);

  if (loading || !initialEval) return <PageLayout><SkeletonPage /></PageLayout>;

  const employee = initialEval.employee;

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
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await submitEvaluation(initialEval.id, dimensions);
    setSubmitting(false);
    setShowCelebration(true);
  };

  const completedCount = dimensions.filter(d => d.score > 0 && d.comment.trim().length > 0).length;

  return (
    <PageLayout title="Growth Conversation" subtitle={`Monthly coaching for ${employee?.name || 'Team Member'}`}>
      {showCelebration && (
        <CelebrationScreen
          managerName={currentUser?.name?.split(' ')[0] || 'Manager'}
          employeeName={employee?.name || 'Team Member'}
          onBack={() => navigate('/manager')}
          onNext={() => navigate('/manager')}
        />
      )}

      {/* Header Info */}
      <div className="card card-pad form-header-card fade-in">
        <div className="form-header-left">
          <Avatar name={employee?.name} size="lg" />
          <div>
            <h2 className="form-employee-name">{employee?.name}</h2>
            <div className="form-employee-title">{employee?.title} · {employee?.departmentId}</div>
          </div>
        </div>
        <div className="form-header-right">
          <FeedbackLifecyclePill status={initialEval.status} />
          <div className="form-progress-text">
            <span>{completedCount} of 5 completed</span>
          </div>
        </div>
      </div>

      {/* Dimensions Accordion */}
      <div className="form-dimensions fade-in">
        {parameters.map((param, index) => {
          const dimState = dimensions.find(d => d.parameterId === param.id) || { score: 0, comment: '' };
          const isOpen = openIndex === index;
          const isComplete = dimState.score > 0 && dimState.comment.trim().length > 0;
          const ParamIcon = ICON_MAP[param.iconName] || Target;

          return (
            <div key={param.id} className={`card dimension-card ${isOpen ? 'open' : ''}`}>
              <div className="dimension-header" onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                <div className="dimension-header-title">
                  <span className="dim-icon"><ParamIcon size={18} color="var(--color-primary)" /></span>
                  <span className="dim-index">{index + 1}.</span>
                  <span className="dim-label">{param.label}</span>
                  {isComplete && <Check size={16} className="dim-check" />}
                </div>
                <div className="dimension-header-right">
                  <StarRating value={dimState.score} size="sm" />
                  <span className="dim-toggle">{isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
                </div>
              </div>

              {isOpen && (
                <div className="dimension-content fade-in">
                  <div className="dim-rating-section">
                    <label className="dim-input-label">How would you score {employee?.name?.split(' ')[0]}'s {param.label.toLowerCase()} this month?</label>
                    <StarRating
                      value={dimState.score}
                      interactive={true}
                      size="lg"
                      onChange={(val) => handleScoreChange(param.id, val)}
                    />
                  </div>

                  <div className="dim-comment-section">
                    <label className="dim-input-label">Tell {employee?.name?.split(' ')[0]} why</label>
                    <textarea
                      className="dim-textarea"
                      placeholder={`Share specific feedback about ${param.label.toLowerCase()}...`}
                      rows={4}
                      value={dimState.comment}
                      onChange={(e) => handleCommentChange(param.id, e.target.value)}
                    />
                  </div>

                  {/* Coaching Tip */}
                  <div className="coaching-tip flex items-center gap-2">
                    <Lightbulb size={16} className="tip-icon flex-shrink-0" />
                    <span className="tip-text">{param.tip}</span>
                  </div>

                  {/* Quality Meter */}
                  <FeedbackQualityMeter text={dimState.comment} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="form-footer-actions fade-in">
        <Button variant="ghost" onClick={handleSaveDraft} loading={saving}>
          Save as Draft
        </Button>
        <Button variant="primary" onClick={handleSubmit} loading={submitting} disabled={completedCount < 5}>
          Share Conversation →
        </Button>
      </div>
    </PageLayout>
  );
}

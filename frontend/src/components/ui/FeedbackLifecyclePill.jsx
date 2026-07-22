// components/ui/FeedbackLifecyclePill.jsx
import './FeedbackLifecyclePill.css';

const STEPS = ['draft', 'pending', 'submitted', 'reviewed', 'locked'];
const LABELS = { draft: 'Draft', pending: 'Pending', submitted: 'Shared', reviewed: 'Reviewed', locked: 'Complete' };

export function FeedbackLifecyclePill({ status }) {
  const currentIdx = STEPS.indexOf(status);
  return (
    <div className="lifecycle">
      {STEPS.map((step, i) => (
        <div key={step} className="lifecycle-item">
          <div className={`lifecycle-dot ${i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'future'}`} />
          <span className={`lifecycle-label ${i === currentIdx ? 'lifecycle-current' : ''}`}>
            {LABELS[step]}
          </span>
          {i < STEPS.length - 1 && <div className={`lifecycle-line ${i < currentIdx ? 'done' : ''}`} />}
        </div>
      ))}
    </div>
  );
}

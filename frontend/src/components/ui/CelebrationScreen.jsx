// components/ui/CelebrationScreen.jsx
import { CheckCircle2 } from 'lucide-react';
import './CelebrationScreen.css';
import { Button } from './Button';

export function CelebrationScreen({ managerName, employeeName, onNext, onBack }) {
  return (
    <div className="celebration soft-fade">
      <div className="celebration-inner">
        <div className="celebration-icon">
          <CheckCircle2 size={48} color="var(--color-primary)" />
        </div>
        <h2 className="celebration-title">Thanks, {managerName}.</h2>
        <p className="celebration-sub">
          Your growth conversation with <strong>{employeeName}</strong> has been shared.
        </p>
        <p className="celebration-quote">
          "Meaningful conversations help teams grow."
        </p>
        <div className="celebration-actions">
          <Button variant="ghost" onClick={onBack}>Back to Team</Button>
          {onNext && <Button variant="primary" onClick={onNext}>Start Next →</Button>}
        </div>
      </div>
    </div>
  );
}

// components/ui/EmptyState.jsx
import { CheckCircle2 } from 'lucide-react';
import './EmptyState.css';
import { Button } from './Button';

export function EmptyState({ title, description, action, onAction, icon }) {
  return (
    <div className="empty-state fade-in">
      <div className="empty-icon">{icon || <CheckCircle2 size={36} color="var(--color-primary)" />}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-desc">{description}</p>
      {action && <Button variant="secondary" onClick={onAction}>{action}</Button>}
    </div>
  );
}

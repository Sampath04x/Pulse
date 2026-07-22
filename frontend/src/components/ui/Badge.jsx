// components/ui/Badge.jsx
import './Badge.css';

const STATUS_MAP = {
  draft:     { label: 'Draft',     cls: 'badge-draft' },
  pending:   { label: 'Pending',   cls: 'badge-pending' },
  submitted: { label: 'Shared',    cls: 'badge-submitted' },
  reviewed:  { label: 'Reviewed',  cls: 'badge-reviewed' },
  locked:    { label: 'Complete',  cls: 'badge-locked' },
  overdue:   { label: 'Overdue',   cls: 'badge-overdue' },
  'due-today':{ label: 'Due Today', cls: 'badge-overdue' },
  success:   { label: 'Done',      cls: 'badge-locked' },
  up:        { label: '↑ Improving', cls: 'badge-up' },
  stable:    { label: '→ Stable',  cls: 'badge-stable' },
  down:      { label: '↓ Needs attention', cls: 'badge-overdue' },
};

export function Badge({ status, label, variant }) {
  const config = STATUS_MAP[status] || STATUS_MAP[variant] || { label: label || status, cls: 'badge-draft' };
  return (
    <span className={`badge ${config.cls}`}>
      {label || config.label}
    </span>
  );
}

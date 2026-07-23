// components/ui/ProgressBar.jsx
import './ProgressBar.css';

export function ProgressBar({ value = 0, max = 100, size = 'md', showLabel = false, color, style }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`progress-track progress-${size}`} style={style}>
      <div
        className="progress-fill-bar progress-fill"
        style={{ width: `${pct}%`, background: color || 'var(--color-primary)' }}
      />
      {showLabel && <span className="progress-label">{Math.round(pct)}%</span>}
    </div>
  );
}

// components/ui/StatCard.jsx
import './StatCard.css';

export function StatCard({ icon, value, label, trend, trendDir, sub, highlight }) {
  return (
    <div className={`stat-card card card-pad ${highlight ? 'stat-card-highlight' : ''}`}>
      {icon && <span className="stat-icon">{icon}</span>}
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className={`stat-trend stat-trend-${trendDir || 'up'}`}>
          {trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '→'} {trend}
        </div>
      )}
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

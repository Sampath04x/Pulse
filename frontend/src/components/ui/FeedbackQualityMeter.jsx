// components/ui/FeedbackQualityMeter.jsx
import { Sparkles, AlertCircle } from 'lucide-react';
import './FeedbackQualityMeter.css';

function getMeterConfig(text = '') {
  const len = text.trim().length;
  if (len === 0)   return { pct: 0,   label: '',                               cls: '',           badge: null, isWarn: false };
  if (len < 20)    return { pct: 20,  label: 'Too short',                      cls: 'meter-low',  badge: null, isWarn: false };
  if (len < 40)    return { pct: 40,  label: 'Needs more detail',              cls: 'meter-mid',  badge: 'Try adding a specific example.', isWarn: true };
  if (len < 80)    return { pct: 65,  label: 'Good',                           cls: 'meter-good', badge: null, isWarn: false };
  if (len < 120)   return { pct: 82,  label: 'Strong',                         cls: 'meter-great',badge: null, isWarn: false };
  return           { pct: 100, label: 'Excellent',                      cls: 'meter-excel',badge: 'Specific · Constructive · Balanced', isWarn: false };
}

export function FeedbackQualityMeter({ text }) {
  const config = getMeterConfig(text);
  if (config.pct === 0) return null;

  return (
    <div className="fqm fade-in">
      <div className="fqm-header">
        <span className="fqm-title">Conversation Quality</span>
        <span className={`fqm-label ${config.cls}`}>{config.label}</span>
      </div>
      <div className="fqm-track">
        <div className={`fqm-fill ${config.cls}`} style={{ width: `${config.pct}%` }} />
      </div>
      {config.badge && (
        <div className={`fqm-badge ${config.cls} flex items-center gap-1`}>
          {config.isWarn ? <AlertCircle size={12} /> : <Sparkles size={12} />}
          <span>{config.badge}</span>
        </div>
      )}
    </div>
  );
}

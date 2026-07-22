// components/layout/CompanySwitcher.jsx
import { useState } from 'react';
import { ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './CompanySwitcher.css';

export function CompanySwitcher() {
  const { currentCompany, companies, switchCompany } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="cs-wrapper">
      <button className="cs-trigger" onClick={() => setOpen(o => !o)}>
        <Building2 size={15} className="cs-icon" />
        <span className="cs-name">{currentCompany?.name}</span>
        {open ? <ChevronUp size={14} className="cs-arrow" /> : <ChevronDown size={14} className="cs-arrow" />}
      </button>
      {open && (
        <div className="cs-dropdown scale-in">
          {companies.map(c => (
            <button
              key={c.id}
              className={`cs-option ${c.id === currentCompany?.id ? 'cs-active' : ''}`}
              onClick={() => { switchCompany(c.id); setOpen(false); }}
            >
              <Building2 size={14} />
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

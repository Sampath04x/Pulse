// components/layout/NotificationCenter.jsx
import { useState } from 'react';
import { Bell, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import './NotificationCenter.css';

export function NotificationCenter({ notifications = [] }) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  const renderIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertCircle size={16} color="#F59E0B" />;
      case 'info':
        return <Info size={16} color="#3B82F6" />;
      case 'success':
        return <CheckCircle2 size={16} color="#2F7D5A" />;
      default:
        return <Info size={16} color="#6B7280" />;
    }
  };

  return (
    <div className="nc-wrapper">
      <button className="nc-bell" onClick={() => setOpen(o => !o)} aria-label="Notifications">
        <Bell size={18} />
        {unread > 0 && <span className="nc-badge">{unread}</span>}
      </button>
      {open && (
        <div className="nc-dropdown scale-in">
          <div className="nc-header">Notifications</div>
          <div className="nc-divider" />
          {notifications.length === 0
            ? <div className="nc-empty">All caught up!</div>
            : notifications.map(n => (
              <div key={n.id} className={`nc-item ${!n.read ? 'nc-unread' : ''}`}>
                <span className="nc-item-icon">{renderIcon(n.type)}</span>
                <div>
                  <div className="nc-item-msg">{n.message}</div>
                  <div className="nc-item-time">{n.time}</div>
                </div>
              </div>
            ))
          }
        </div>
      )}
      {open && <div className="nc-overlay" onClick={() => setOpen(false)} />}
    </div>
  );
}

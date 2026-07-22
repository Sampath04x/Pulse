// components/layout/PageLayout.jsx
import { Sidebar } from './Sidebar';
import { NotificationCenter } from './NotificationCenter';
import { useApp } from '../../context/AppContext';
import { notifications } from '../../data/mockData';
import './PageLayout.css';

export function PageLayout({ children, title, subtitle }) {
  const { currentUser } = useApp();

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="page-content">
        {/* Top bar */}
        <header className="page-topbar">
          <div className="page-topbar-left">
            {title && <h1 className="page-topbar-title">{title}</h1>}
            {subtitle && <p className="page-topbar-sub">{subtitle}</p>}
          </div>
          <div className="page-topbar-right">
            <NotificationCenter notifications={notifications} />
            <div className="topbar-user">
              <div className="topbar-avatar">{currentUser?.initials || 'U'}</div>
              <div>
                <div className="topbar-name">{currentUser?.name}</div>
                <div className="topbar-title">{currentUser?.title}</div>
              </div>
            </div>
          </div>
        </header>
        <div className="page-inner fade-in">{children}</div>
      </main>
    </div>
  );
}

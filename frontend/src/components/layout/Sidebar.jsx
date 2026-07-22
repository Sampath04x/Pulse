// components/layout/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  MessageSquare,
  Calendar,
  BookOpen,
  Users,
  FileText,
  BarChart2,
  Building2,
  Settings,
  LogOut,
  Leaf
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompanySwitcher } from './CompanySwitcher';
import './Sidebar.css';

const NAV = {
  employee: [
    { to: '/employee',       icon: Home,          label: 'Home' },
    { to: '/growth',         icon: TrendingUp,    label: 'My Growth' },
    { to: '/conversations',  icon: MessageSquare, label: 'Conversations' },
    { to: '/calendar',       icon: Calendar,      label: 'Calendar' },
    { to: '/resources',      icon: BookOpen,      label: 'Resources' },
  ],
  manager: [
    { to: '/manager',        icon: Home,          label: 'Home' },
    { to: '/team',           icon: Users,         label: 'Team' },
    { to: '/reviews',        icon: FileText,      label: 'Reviews' },
    { to: '/insights',       icon: BarChart2,     label: 'Insights' },
    { to: '/organization',   icon: Building2,     label: 'Organization' },
  ],
  hr: [
    { to: '/hr',             icon: Home,          label: 'Overview' },
    { to: '/companies',      icon: Building2,     label: 'Companies' },
    { to: '/members',        icon: Users,         label: 'Team Members' },
    { to: '/progress',       icon: BarChart2,     label: 'Progress' },
    { to: '/settings',       icon: Settings,      label: 'Settings' },
  ],
};

export function Sidebar() {
  const { activeRole, currentUser, currentCompany, logout } = useApp();
  const navigate = useNavigate();
  const links = NAV[activeRole] || NAV.employee;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon-wrapper">
          <Leaf className="sidebar-logo-icon" />
        </div>
        <div>
          <div className="sidebar-logo-text">Pulse</div>
          <div className="sidebar-logo-sub">by sowaka</div>
        </div>
      </div>

      {/* Company Switcher */}
      {(activeRole === 'manager' || activeRole === 'hr') && (
        <div className="sidebar-company">
          <CompanySwitcher />
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            <Icon className="sidebar-link-icon" size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {currentUser?.initials || 'U'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser?.name?.split(' ')[0]}</div>
            <div className="sidebar-user-role">{activeRole}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={14} style={{ marginRight: 6 }} /> Logout
        </button>
      </div>
    </aside>
  );
}

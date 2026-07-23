// components/layout/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, TrendingUp, MessageSquare, Calendar,
  Users, FileText, BarChart2, Building2,
  Settings, LogOut, Leaf, ChevronDown, ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CompanySwitcher } from './CompanySwitcher';
import './Sidebar.css';

const NAV = {
  employee: [
    { to: '/employee',      icon: Home,          label: 'Home' },
    { to: '/growth',        icon: TrendingUp,    label: 'My Growth' },
    { to: '/conversations', icon: MessageSquare, label: 'Conversations' },
    { to: '/calendar',      icon: Calendar,      label: 'Calendar' },
  ],
  manager: [
    { to: '/manager',       icon: Home,          label: 'Dashboard' },
    { to: '/team',          icon: Users,         label: 'Team' },
    { to: '/reviews',       icon: FileText,      label: 'Reviews' },
    { to: '/insights',      icon: BarChart2,     label: 'Insights' },
    { to: '/organization',  icon: Building2,     label: 'Org Chart' },
  ],
  hr: [
    { to: '/hr',            icon: Home,          label: 'Overview' },
    { to: '/members',       icon: Users,         label: 'People' },
    { to: '/progress',      icon: BarChart2,     label: 'Analytics' },
    { to: '/organization',  icon: Building2,     label: 'Org Chart' },
    { to: '/admin',         icon: ShieldCheck,   label: 'Admin' },
    { to: '/settings',      icon: Settings,      label: 'Settings' },
  ],
};

const ROLE_LABEL = { employee: 'Employee', manager: 'Manager', hr: 'HR Admin' };
const ROLE_HOME  = { employee: '/employee', manager: '/manager', hr: '/hr' };

export function Sidebar() {
  const { activeRole, currentUser, logout, switchRole } = useApp();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const links = NAV[activeRole] || NAV.employee;
  const availableRoles = currentUser?.roles || [];
  const canSwitchRoles = availableRoles.length > 1;

  function handleLogout() { logout(); navigate('/'); }

  function handleRoleSwitch(newRole) {
    if (switchRole) switchRole(newRole);
    setRoleMenuOpen(false);
    navigate(ROLE_HOME[newRole] || '/');
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

      {/* Role indicator + switcher */}
      {canSwitchRoles ? (
        <div className="sidebar-role-wrapper">
          <button className="sidebar-role-btn" onClick={() => setRoleMenuOpen(o => !o)}>
            <span className="sidebar-role-label">{ROLE_LABEL[activeRole] || activeRole}</span>
            <ChevronDown size={12} className="sidebar-role-chevron" />
          </button>
          {roleMenuOpen && (
            <div className="sidebar-role-menu scale-in">
              {availableRoles.map(role => (
                <button
                  key={role}
                  className={`sidebar-role-option ${role === activeRole ? 'sidebar-role-option-active' : ''}`}
                  onClick={() => handleRoleSwitch(role)}
                >
                  {ROLE_LABEL[role] || role}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="sidebar-role-badge">{ROLE_LABEL[activeRole] || activeRole}</div>
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
          <div className="sidebar-user-avatar">{currentUser?.initials || 'U'}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{currentUser?.name?.split(' ')[0]}</div>
            <div className="sidebar-user-role">{ROLE_LABEL[activeRole] || activeRole}</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>
          <LogOut size={14} style={{ marginRight: 6 }} /> Logout
        </button>
      </div>
    </aside>
  );
}

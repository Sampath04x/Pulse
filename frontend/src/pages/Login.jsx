import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, User, Users, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { loginAsDemo } from '../services/authService';
import { Button } from '../components/ui/Button';
import './Login.css';

export default function Login() {
  const { login, isAuthenticated, activeRole } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(activeRole === 'manager' ? '/manager' : activeRole === 'hr' ? '/hr' : '/employee');
    }
  }, [isAuthenticated, activeRole, navigate]);

  async function handleDemo(role) {
    setLoading(role);
    setError('');
    try {
      const { user, company, activeRole } = await loginAsDemo(role);
      login(user, company, activeRole || role);
      navigate(role === 'manager' ? '/manager' : role === 'hr' ? '/hr' : '/employee');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="login-shell">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-brand">
          <div className="login-brand-icon-wrapper">
            <Leaf size={24} color="var(--color-primary)" />
          </div>
          <div>
            <div className="login-brand-name">Pulse</div>
            <div className="login-brand-sub">by sowaka</div>
          </div>
        </div>
        <div className="login-hero">
          <h1 className="login-hero-title">
            Monthly conversations.<br />
            Stronger teams.<br />
            Better every day.
          </h1>
          <p className="login-hero-sub">
            Growing people. Growing teams.
          </p>
        </div>
        <div className="login-illustration">
          <div className="login-illus-circles">
            <div className="illus-circle illus-c1" />
            <div className="illus-circle illus-c2" />
            <div className="illus-circle illus-c3" />
          </div>
          <Leaf size={60} color="var(--color-primary)" opacity={0.3} className="illus-leaves" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-form-card card card-pad fade-in">
          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-sub">Sign in to continue to Pulse</p>

          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label>Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="login-input"
            />
          </div>
          <div className="login-field">
            <div className="login-field-row">
              <label>Password</label>
              <a href="#" className="login-forgot">Forgot password?</a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="login-input"
            />
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={() => handleDemo('manager')} loading={loading === 'form'}>
            Sign In
          </Button>

          <div className="login-divider"><span>Try a demo</span></div>

          <div className="login-demo-grid">
            <button className="login-demo-btn flex items-center justify-center gap-1" onClick={() => handleDemo('manager')} disabled={!!loading}>
              <User size={14} />
              <span>{loading === 'manager' ? '...' : 'Manager'}</span>
            </button>
            <button className="login-demo-btn flex items-center justify-center gap-1" onClick={() => handleDemo('employee')} disabled={!!loading}>
              <Users size={14} />
              <span>{loading === 'employee' ? '...' : 'Team Member'}</span>
            </button>
            <button className="login-demo-btn flex items-center justify-center gap-1" onClick={() => handleDemo('hr')} disabled={!!loading}>
              <Building2 size={14} />
              <span>{loading === 'hr' ? '...' : 'HR'}</span>
            </button>
          </div>

          <p className="login-terms">
            By continuing you agree to our <a href="#">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
}

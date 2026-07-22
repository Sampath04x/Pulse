import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Users, Building2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import './Welcome.css';

export default function Welcome() {
  const navigate = useNavigate();
  const { isAuthenticated, activeRole } = useApp();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(activeRole === 'manager' ? '/manager' : activeRole === 'hr' ? '/hr' : '/employee');
    }
  }, [isAuthenticated, activeRole, navigate]);

  return (
    <div className="welcome-shell fade-in">
      <div className="card card-pad welcome-card">
        <div className="welcome-logo-wrapper">
          <Leaf size={40} color="var(--color-primary)" />
        </div>
        <h1 className="welcome-title">Welcome to Pulse</h1>
        <div className="welcome-tagline">by sowaka</div>

        <p className="welcome-desc">
          Growing people. Growing teams.<br />
          Replace traditional reviews with lightweight, continuous monthly growth conversations.
        </p>

        <div className="welcome-features">
          <div className="w-feature">
            <Users size={20} color="var(--color-primary)" />
            <div>
              <strong>Coaching-First</strong>
              <p>Focus on development, not evaluation.</p>
            </div>
          </div>
          <div className="w-feature">
            <Building2 size={20} color="var(--color-primary)" />
            <div>
              <strong>Multi-Tenant Ready</strong>
              <p>Organize multiple companies & teams.</p>
            </div>
          </div>
          <div className="w-feature">
            <Sparkles size={20} color="var(--color-primary)" />
            <div>
              <strong>Smart Feedback</strong>
              <p>Built-in quality guidance & tips.</p>
            </div>
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/login')}>
          Get Started →
        </Button>
      </div>
    </div>
  );
}

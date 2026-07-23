// pages/OrganizationTree.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getOrgTree } from '../services/hrService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { Avatar } from '../components/ui/Avatar';
import { StarRating } from '../components/ui/StarRating';
import { Button } from '../components/ui/Button';
import { 
  Building2, Users, Star, ArrowRight, Shield, 
  MessageSquare, FileText, Activity 
} from 'lucide-react';
import { getUserById, evaluations as allEvaluations } from '../data/mockData';
import './OrganizationTree.css';

export default function OrganizationTree() {
  const { currentCompany, activeRole } = useApp();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);

  const { data: tree, loading } = useAsync(
    () => getOrgTree(currentCompany?.id || 'ashoka'),
    [currentCompany?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  // Find selected user's rich info
  const selectedUser = selectedUserId ? getUserById(selectedUserId) : null;
  const isManagerOrHR = activeRole === 'manager' || activeRole === 'hr';

  // Get selected user's latest review & manager
  const userEval = selectedUserId 
    ? allEvaluations.find(e => e.employeeId === selectedUserId && ['locked', 'submitted'].includes(e.status))
    : null;

  const userManager = selectedUser?.managerId ? getUserById(selectedUser.managerId) : null;

  // Build a custom recursive tree component
  const renderNode = (node) => {
    if (!node) return null;
    const isSelected = selectedUserId === node.id;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="tree-node-container">
        <div
          className={`card org-node-card ${isSelected ? 'selected' : ''} ${hasChildren ? 'has-reports' : ''}`}
          onClick={() => setSelectedUserId(node.id)}
        >
          <Avatar name={node.name} size="md" />
          <div className="org-node-info">
            <div className="org-node-name">{node.name}</div>
            <div className="org-node-title">{node.title}</div>
            <div className="org-node-dept-label">{node.department_id || 'Team'}</div>
          </div>
        </div>

        {hasChildren && (
          <div className="tree-children">
            {node.children.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <PageLayout
      title={`Organization Hierarchy`}
      subtitle={`Interactive reporting structure and team coaching status for ${currentCompany?.name || 'Sowaka'}`}
    >
      <div className="org-page-layout">
        {/* Left side: Org chart tree */}
        <div className="org-tree-wrapper card card-pad fade-in">
          {tree ? (
            <div className="tree-root-container">
              {renderNode(tree)}
            </div>
          ) : (
            <div className="org-empty">
              <Building2 size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p>No organization tree available.</p>
            </div>
          )}
        </div>

        {/* Right side details drawer/sidebar */}
        {selectedUser && (
          <div className="card card-pad org-detail-sidebar fade-in">
            <div className="org-detail-header">
              <Avatar name={selectedUser.name} size="xl" />
              <div className="org-detail-title-block">
                <h3 className="org-detail-name">{selectedUser.name}</h3>
                <div className="org-detail-role">{selectedUser.title}</div>
                <span className="org-detail-dept">{selectedUser.departmentId || 'Operations'}</span>
              </div>
            </div>

            <div className="org-detail-body">
              {/* Manager name */}
              <div className="org-detail-stat">
                <span className="org-stat-label">Reports to</span>
                <span className="org-stat-val">
                  {userManager ? `${userManager.name} (${userManager.title})` : 'CEO / Board'}
                </span>
              </div>

              {/* Performance Score */}
              <div className="org-detail-stat">
                <span className="org-stat-label">Performance Rating (Current Cycle)</span>
                {userEval ? (
                  <div className="org-stat-val-row">
                    <StarRating value={userEval.overallScore || userEval.overall_score || 0} size="sm" />
                    <span className="org-stat-num">{(userEval.overallScore || userEval.overall_score || 0).toFixed(1)} / 5</span>
                  </div>
                ) : (
                  <span className="org-stat-val text-muted" style={{ fontStyle: 'italic', fontSize: 'var(--font-xs)' }}>
                    No reviews finalized for July 2024
                  </span>
                )}
              </div>

              {/* Latest feedback snippet */}
              {userEval && userEval.dimensions?.some(d => d.comment) && (
                <div className="org-detail-stat">
                  <span className="org-stat-label">Coaching Notes Highlight</span>
                  <p className="org-detail-quote">
                    "{userEval.dimensions.find(d => d.comment)?.comment}"
                  </p>
                </div>
              )}

              {/* Employee Join date */}
              {selectedUser.joinDate && (
                <div className="org-detail-stat">
                  <span className="org-stat-label">Tenure</span>
                  <span className="org-stat-val">
                    Joined {new Date(selectedUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}

              {/* Direct Reports Count */}
              <div className="org-detail-stat">
                <span className="org-stat-label">Direct Reports</span>
                <span className="org-stat-val">
                  {selectedUser.roles?.includes('manager') ? 'People Leader' : 'Individual Contributor'}
                </span>
              </div>
            </div>

            {/* Actions for managers or HR */}
            {isManagerOrHR && (
              <div className="org-detail-actions">
                <Button 
                  variant="primary" 
                  size="sm" 
                  fullWidth
                  onClick={() => navigate(`/growth?employee_id=${selectedUser.id}`)}
                >
                  <Activity size={14} style={{ marginRight: 6 }} />
                  View Full Growth Journey
                </Button>
              </div>
            )}

            <Button variant="ghost" size="sm" onClick={() => setSelectedUserId(null)}>
              Deselect Member
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

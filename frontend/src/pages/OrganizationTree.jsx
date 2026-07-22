// pages/OrganizationTree.jsx
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAsync } from '../hooks/useAsync';
import { getOrgTree } from '../services/hrService';
import { PageLayout } from '../components/layout/PageLayout';
import { SkeletonPage } from '../components/ui/Skeleton';
import { Avatar } from '../components/ui/Avatar';
import { StarRating } from '../components/ui/StarRating';
import { Button } from '../components/ui/Button';
import './OrganizationTree.css';

export default function OrganizationTree() {
  const { currentCompany } = useApp();
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: tree, loading } = useAsync(
    () => getOrgTree(currentCompany?.id || 'ashoka'),
    [currentCompany?.id]
  );

  if (loading) return <PageLayout><SkeletonPage /></PageLayout>;

  const renderNode = (node) => {
    if (!node) return null;
    const isSelected = selectedUser?.id === node.id;

    return (
      <div key={node.id} className="tree-node-container">
        <div
          className={`card org-node-card ${isSelected ? 'selected' : ''}`}
          onClick={() => setSelectedUser(node)}
        >
          <Avatar name={node.name} size="md" />
          <div className="org-node-info">
            <div className="org-node-name">{node.name}</div>
            <div className="org-node-title">{node.title}</div>
          </div>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="tree-children">
            {node.children.map((child) => renderNode(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <PageLayout
      title={`Organization — ${currentCompany?.name || 'Sowaka'}`}
      subtitle="Interactive reporting structure and team hierarchy"
    >
      <div className="org-page-layout">
        <div className="org-tree-wrapper card card-pad fade-in">
          {tree ? renderNode(tree) : <div className="org-empty">🌿 No organization tree available.</div>}
        </div>

        {/* Selected Member Drawer / Sidebar */}
        {selectedUser && (
          <div className="card card-pad org-detail-sidebar fade-in">
            <div className="org-detail-header">
              <Avatar name={selectedUser.name} size="xl" />
              <div className="org-detail-title-block">
                <h3 className="org-detail-name">{selectedUser.name}</h3>
                <div className="org-detail-role">{selectedUser.title}</div>
                <div className="org-detail-dept">{selectedUser.departmentId}</div>
              </div>
            </div>

            <div className="org-detail-body">
              <div className="org-detail-stat">
                <span className="org-stat-label">Growth Rating</span>
                <div className="org-stat-val-row">
                  <StarRating value={4.2} size="sm" />
                  <span className="org-stat-num">4.2 / 5</span>
                </div>
              </div>

              <div className="org-detail-stat">
                <span className="org-stat-label">Latest Feedback</span>
                <p className="org-detail-quote">
                  "Consistently strong ownership on major deliverables this month."
                </p>
              </div>

              <div className="org-detail-stat">
                <span className="org-stat-label">Direct Reports</span>
                <span className="org-stat-val">{selectedUser.children?.length || 0} members</span>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
              Close Sidebar
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}

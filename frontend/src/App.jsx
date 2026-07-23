// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import Welcome from './pages/Welcome';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import HRDashboard from './pages/HRDashboard';
import FeedbackForm from './pages/FeedbackForm';
import EmployeeGrowthHistory from './pages/EmployeeGrowthHistory';
import TeamOverview from './pages/TeamOverview';
import OrganizationTree from './pages/OrganizationTree';

function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, activeRole } = useApp();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(activeRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />

      {/* Employee Routes */}
      <Route
        path="/employee"
        element={<ProtectedRoute allowedRoles={['employee']}><EmployeeDashboard /></ProtectedRoute>}
      />
      <Route
        path="/growth"
        element={<ProtectedRoute allowedRoles={['employee', 'manager', 'hr']}><EmployeeGrowthHistory /></ProtectedRoute>}
      />

      {/* Manager Routes */}
      <Route
        path="/manager"
        element={<ProtectedRoute allowedRoles={['manager', 'hr']}><ManagerDashboard /></ProtectedRoute>}
      />
      <Route
        path="/team"
        element={<ProtectedRoute allowedRoles={['manager', 'hr']}><TeamOverview /></ProtectedRoute>}
      />
      <Route
        path="/feedback/:id"
        element={<ProtectedRoute allowedRoles={['manager', 'hr']}><FeedbackForm /></ProtectedRoute>}
      />

      {/* HR Routes */}
      <Route
        path="/hr"
        element={<ProtectedRoute allowedRoles={['hr']}><HRDashboard /></ProtectedRoute>}
      />
      <Route
        path="/organization"
        element={<ProtectedRoute allowedRoles={['hr', 'manager']}><OrganizationTree /></ProtectedRoute>}
      />

      {/* Fallback & placeholder routes */}
      <Route path="/conversations" element={<ProtectedRoute><EmployeeGrowthHistory /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
      <Route path="/reviews" element={<ProtectedRoute><TeamOverview /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/companies" element={<ProtectedRoute><HRDashboard /></ProtectedRoute>} />
      <Route path="/members" element={<ProtectedRoute><TeamOverview /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><HRDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['hr', 'admin']}><HRDashboard /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><HRDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

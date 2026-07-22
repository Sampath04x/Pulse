// context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { getCompanies } from '../services/companyService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser]       = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [activeRole, setActiveRole]         = useState(null);
  const [isLoading, setIsLoading]           = useState(false);
  const [companies, setCompanies]           = useState([]);

  // Apply theme whenever company changes
  useTheme(currentCompany?.theme || 'theme-ashoka');

  // Load companies from API on mount
  useEffect(() => {
    getCompanies()
      .then(data => setCompanies(data))
      .catch(() => {
        // Fallback to seeded defaults if API unreachable
        setCompanies([
          { id: 'ashoka',     name: 'Ashoka Textiles',        theme: 'theme-ashoka',     logo: 'AT', tagline: 'Crafting futures, thread by thread.' },
          { id: 'brightpath', name: 'Bright Path Consulting',  theme: 'theme-brightpath', logo: 'BP', tagline: 'Clarity in every decision.' },
        ]);
      });
  }, []);

  function login(user, company, role) {
    setCurrentUser(user);
    setCurrentCompany(company);
    setActiveRole(role || user.roles[0]);
  }

  function logout() {
    setCurrentUser(null);
    setCurrentCompany(null);
    setActiveRole(null);
  }

  function switchCompany(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (company) setCurrentCompany(company);
  }

  function switchRole(role) {
    if (currentUser?.roles.includes(role)) setActiveRole(role);
  }

  const isAuthenticated = !!currentUser;

  return (
    <AppContext.Provider value={{
      currentUser,
      currentCompany,
      activeRole,
      isLoading,
      isAuthenticated,
      companies,
      login,
      logout,
      switchCompany,
      switchRole,
      setIsLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

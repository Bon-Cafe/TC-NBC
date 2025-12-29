
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import GenericForm from './pages/GenericForm';
import SchedulePage from './pages/SchedulePage';
import DashboardHistory from './pages/DashboardHistory';
import { Category, User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nbc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (username: string) => {
    const newUser = {
      username,
      role: 'Training Coordinator',
      avatar: `https://picsum.photos/seed/${username}/200/200`
    };
    setUser(newUser);
    localStorage.setItem('nbc_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nbc_user');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/branch-visit" element={<GenericForm category={Category.BranchVisit} />} />
          <Route path="/employee-evaluation" element={<GenericForm category={Category.EmployeeEvaluation} />} />
          <Route path="/report-problem" element={<GenericForm category={Category.ReportProblem} />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/dashboard" element={<DashboardHistory />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;


import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import GenericForm from './pages/GenericForm';
import SchedulePage from './pages/SchedulePage';
import DashboardHistory from './pages/DashboardHistory';
import { Category, User } from './types';

const App: React.FC = () => {
  const [apiUrl, setApiUrl] = useState(() => localStorage.getItem('nbc_api_url'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nbc_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (username: string) => {
    const newUser = {
      username,
      role: 'Training Coordinator',
      avatar: `https://ui-avatars.com/api/?name=${username}&background=FF8C00&color=fff`
    };
    setUser(newUser);
    localStorage.setItem('nbc_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nbc_user');
  };

  const handleApiSetup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get('apiUrl') as string;
    if (url && url.startsWith('https://script.google.com')) {
      localStorage.setItem('nbc_api_url', url);
      setApiUrl(url);
    } else {
      alert("Please enter a valid Google Apps Script Web App URL.");
    }
  };

  // 1. If Backend is not linked yet
  if (!apiUrl) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border-t-8 border-orange-500 animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
            <i className="fa-solid fa-link text-2xl"></i>
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Connect Backend</h2>
          <p className="text-gray-500 text-sm mb-6">
            Paste your <strong>Google Apps Script Web App URL</strong> below to connect this portal to your Google Sheets.
          </p>
          <form onSubmit={handleApiSetup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Web App URL</label>
              <input 
                name="apiUrl"
                required
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:border-orange-500 text-sm transition-all"
              />
            </div>
            <button className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-black transition-all shadow-lg">
              Initialize Portal
            </button>
          </form>
          <p className="mt-6 text-[10px] text-gray-400 text-center uppercase font-bold tracking-widest">
            New Bon Cafe Portal Setup
          </p>
        </div>
      </div>
    );
  }

  // 2. If User is not logged in
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 3. Main Application
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

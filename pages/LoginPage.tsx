
import React, { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Top Tone - Orange */}
      <div className="h-1/2 bg-orange-500 absolute top-0 left-0 right-0 z-0">
        <div className="absolute inset-0 bg-black/5 opacity-10 pattern-grid-lg"></div>
      </div>
      
      {/* Bottom Tone - Light Grey */}
      <div className="h-1/2 bg-gray-100 absolute bottom-0 left-0 right-0 z-0"></div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
          <div className="p-8 pb-4 text-center">
            {/* Logo Placeholder */}
            <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-white shadow-md">
               <span className="text-orange-600 font-black text-3xl">BON</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">NBC PORTAL</h1>
            <p className="text-gray-500 mt-2">Training Coordinator Access</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95"
            >
              Log In
            </button>
          </form>
          
          <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">New Bon Cafe • Professional Excellence</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

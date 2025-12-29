
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_CARDS } from '../constants';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Training Dashboard</h1>
          <p className="text-gray-500 mt-1">Select a task to begin your workflow</p>
        </div>
        <div className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
          Last sync: Just now
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORY_CARDS.map((cat) => (
          <Link
            key={cat.name}
            to={`/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
          >
            <div className={`mb-6 p-4 rounded-2xl ${cat.color} text-white transform transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
              <div className="w-10 h-10">{cat.icon}</div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{cat.name}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Complete {cat.name.toLowerCase()} tasks and submit reports directly to management.
            </p>
            <div className="mt-6 flex items-center text-orange-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              Get Started <span className="ml-1">→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="bg-gray-800 rounded-2xl p-6 text-white grid grid-cols-1 md:grid-cols-3 gap-8 shadow-inner">
        <div className="flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-700 pb-6 md:pb-0">
          <span className="text-3xl font-bold text-orange-400">12</span>
          <span className="text-sm text-gray-400 mt-1">Visits This Week</span>
        </div>
        <div className="flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-700 pb-6 md:pb-0">
          <span className="text-3xl font-bold text-orange-400">98%</span>
          <span className="text-sm text-gray-400 mt-1">Evaluation Score Avg.</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-orange-400">03</span>
          <span className="text-sm text-gray-400 mt-1">Pending Problems</span>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

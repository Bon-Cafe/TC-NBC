
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Category, FormSubmission, ScheduleEntry } from '../types';
import { 
  ClipboardDocumentIcon, 
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const DashboardHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Category>(Category.BranchVisit);
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const subData = await storageService.getSubmissions();
      const schData = await storageService.getSchedules();
      setSubmissions(subData);
      setSchedules(schData);
    } catch (e) {
      console.error("Error fetching data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSubmissions = submissions.filter(s => s.category === activeTab);

  const renderTable = () => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center p-20 gap-4">
        <ArrowPathIcon className="w-10 h-10 animate-spin text-orange-500" />
        <p className="text-gray-500 font-medium">Fetching records from Google Sheets...</p>
      </div>
    );

    if (activeTab === Category.Schedule) {
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Assign To</th>
                <th className="px-6 py-4">Branches</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {schedules.map((sch) => (
                <tr key={sch.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{sch.date}</td>
                  <td className="px-6 py-4 text-sm">{sch.assignTo}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {sch.branches.map(b => (
                        <span key={b} className="bg-blue-50 text-blue-600 text-[10px] px-1.5 py-0.5 rounded border border-blue-100">{b}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">Scheduled</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-orange-500 hover:text-orange-700 font-bold text-xs flex items-center gap-1">
                      <ArrowDownTrayIcon className="w-4 h-4" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
              {schedules.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No schedules found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    if (activeTab === Category.Dashboard) {
      return (
         <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-200">
            <h2 className="text-xl font-bold text-gray-400">Portal Analytics</h2>
            <p className="text-sm text-gray-300">Live data sync is active from NBC_Portal_Database.</p>
         </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Branch</th>
              <th className="px-6 py-4">Coordinator</th>
              <th className="px-6 py-4">Employees</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredSubmissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm">
                  {new Date(sub.timestamp).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm font-medium">{sub.branchName}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{sub.supervisor}</td>
                <td className="px-6 py-4 text-sm">
                  {sub.employees.length} staff
                </td>
                <td className="px-6 py-4">
                  <button className="text-orange-500 hover:text-orange-700 font-bold text-xs flex items-center gap-1">
                    <ArrowDownTrayIcon className="w-4 h-4" /> View PDF
                  </button>
                </td>
              </tr>
            ))}
            {filteredSubmissions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">No {activeTab} data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portal History & Dashboard</h1>
          <p className="text-gray-500 text-sm">Review previous activity and reports synced from Google Sheets.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchData}
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-orange-500 transition-colors"
            title="Refresh Data"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search records..." 
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b bg-gray-50/50">
          {[Category.BranchVisit, Category.EmployeeEvaluation, Category.ReportProblem, Category.Schedule, Category.Dashboard].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === cat ? 'bg-white text-orange-600 border-b-2 border-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Content */}
        <div className="p-0">
          {renderTable()}
        </div>
      </div>

      {/* Summary Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <ClipboardDocumentIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase font-bold">Total Entries</p>
            <p className="text-xl font-bold">{loading ? '...' : submissions.length + schedules.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHistory;

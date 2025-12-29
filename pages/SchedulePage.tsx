
import React, { useState } from 'react';
import { 
  PlusIcon, 
  XMarkIcon,
  CalendarIcon,
  CheckBadgeIcon,
  PaperAirplaneIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { ASSIGN_TO, ACCOMPANIED_BY, DISTRICT_BRANCHES } from '../constants';
import { storageService } from '../services/storageService';

const SchedulePage: React.FC = () => {
  const [date, setDate] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [accompaniedBy, setAccompaniedBy] = useState('');
  const [district, setDistrict] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['']);
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const addBranch = () => setSelectedBranches([...selectedBranches, '']);
  const removeBranch = (index: number) => {
    setSelectedBranches(selectedBranches.filter((_, i) => i !== index));
  };
  const updateBranch = (index: number, value: string) => {
    const updated = [...selectedBranches];
    updated[index] = value;
    setSelectedBranches(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const schedule = {
      id: Math.random().toString(36).substr(2, 9),
      date,
      assignTo,
      accompaniedBy,
      district,
      branches: selectedBranches.filter(b => b),
      purpose,
      approvedBy: 'Mr. Mohammad Aldos',
      timestamp: new Date().toISOString()
    };

    try {
      await storageService.saveSchedule(schedule);
      setIsSubmitted(true);
    } catch (error) {
      alert("Error saving schedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-lg text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckBadgeIcon className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Schedule Created!</h2>
        <p className="text-gray-500 mt-4 mb-8">
          The schedule has been saved and sent to the administration team and CCs.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600"
        >
          Create Another Schedule
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
       <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Training Visit Schedule</h1>
        <p className="text-gray-500">Plan and assign branch visits.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Date of Visit</label>
              <div className="relative">
                <input 
                  required
                  type="date" 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Assign To</label>
              <select 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
              >
                <option value="">Select Coordinator</option>
                {ASSIGN_TO.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Accompanied By</label>
              <select 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                value={accompaniedBy}
                onChange={(e) => setAccompaniedBy(e.target.value)}
              >
                <option value="">Select Companion</option>
                {ACCOMPANIED_BY.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">District</label>
              <select 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Select District</option>
                {Object.keys(DISTRICT_BRANCHES).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Branches Selection */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-bold text-gray-800">Branches to Visit</h2>
            <button 
              type="button" 
              disabled={!district}
              onClick={addBranch}
              className="p-1.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {!district && <p className="text-sm text-gray-400 italic">Please select a district first to see available branches.</p>}
            {selectedBranches.map((branch, index) => (
              <div key={index} className="flex gap-3 items-center">
                <select 
                  required
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                  value={branch}
                  onChange={(e) => updateBranch(index, e.target.value)}
                >
                  <option value="">Select Branch</option>
                  {district && DISTRICT_BRANCHES[district]?.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                {selectedBranches.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeBranch(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">Purpose of Visit</label>
          <textarea 
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none h-32"
            placeholder="Outline the goals and activities planned for this visit..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        {/* Approval Footer */}
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Official Approval</p>
          <div className="max-w-xs mx-auto space-y-2">
             <div className="h-px bg-gray-200 w-full mb-4"></div>
             <p className="font-bold text-gray-800">Mr. Mohammad Aldos</p>
             <p className="text-xs text-gray-500">Executive Director, Commercial Operations Division</p>
             <p className="text-xs text-orange-600 font-medium">Verified Authority</p>
          </div>
        </div>

        <button 
          disabled={isSubmitting}
          className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isSubmitting ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'}`}
        >
          {isSubmitting ? (
            <ArrowPathIcon className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <PaperAirplaneIcon className="w-6 h-6 rotate-[-20deg]" />
              Create & Send Schedule
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SchedulePage;

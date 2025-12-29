
import React, { useState, useEffect, useRef } from 'react';
import { 
  PlusIcon, 
  XMarkIcon, 
  CameraIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Category, EmployeeEntry, Question } from '../types';
import { BRANCHES, SUPERVISORS, AREA_MANAGERS, TEAM_LEADERS, SAMPLE_QUESTIONS } from '../constants';
import { storageService } from '../services/storageService';

interface GenericFormProps {
  category: Category;
}

const GenericForm: React.FC<GenericFormProps> = ({ category }) => {
  const [branchName, setBranchName] = useState('');
  const [branchSearch, setBranchSearch] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [supervisorSearch, setSupervisorSearch] = useState('');
  const [areaManager, setAreaManager] = useState('');
  const [district, setDistrict] = useState('');
  const [teamLeader, setTeamLeader] = useState('');
  const [employees, setEmployees] = useState<EmployeeEntry[]>([{ id: '', name: '' }]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const questions = SAMPLE_QUESTIONS[category] || [];

  useEffect(() => {
    if (areaManager && AREA_MANAGERS[areaManager]) {
      setDistrict(AREA_MANAGERS[areaManager].district);
    } else {
      setDistrict('');
    }
  }, [areaManager]);

  const addEmployee = () => {
    setEmployees([...employees, { id: '', name: '' }]);
  };

  const removeEmployee = (index: number) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  const updateEmployee = (index: number, field: keyof EmployeeEntry, value: string) => {
    const updated = [...employees];
    updated[index][field] = value;
    setEmployees(updated);
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const submission = {
      id: Math.random().toString(36).substr(2, 9),
      category,
      timestamp: new Date().toISOString(),
      branchName,
      supervisor,
      areaManager,
      district,
      teamLeader,
      employees: employees.filter(e => e.name || e.id),
      responses,
      image: image || undefined
    };

    try {
      await storageService.saveSubmission(submission);
      setIsSubmitted(true);
    } catch (error) {
      alert("Error saving submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-2xl shadow-lg text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800">Form Submitted!</h2>
        <p className="text-gray-500 mt-4 mb-8">
          Your response for <strong>{category}</strong> has been saved to the Google Sheet and a PDF report has been generated for administration.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all"
        >
          Create New Form
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{category} Form</h1>
        <p className="text-gray-500">Please fill in all the details accurately.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Branch Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Branch Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Branch Name</label>
              <input 
                type="text" 
                placeholder="Search branches..." 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-orange-500 outline-none mb-1"
                value={branchSearch}
                onChange={(e) => setBranchSearch(e.target.value)}
              />
              <select 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none max-h-40 overflow-y-auto"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              >
                <option value="">Select Branch</option>
                {BRANCHES.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase())).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            {/* Supervisor Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Supervisor</label>
              <input 
                type="text" 
                placeholder="Search supervisors..." 
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-1 focus:ring-orange-500 outline-none mb-1"
                value={supervisorSearch}
                onChange={(e) => setSupervisorSearch(e.target.value)}
              />
              <select 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
              >
                <option value="">Select Supervisor</option>
                {SUPERVISORS.filter(s => s.toLowerCase().includes(supervisorSearch.toLowerCase())).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Area Manager & Auto District */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Area Manager</label>
              <select 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                value={areaManager}
                onChange={(e) => setAreaManager(e.target.value)}
              >
                <option value="">Select Area Manager</option>
                {Object.keys(AREA_MANAGERS).map(am => (
                  <option key={am} value={am}>{am}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">District</label>
              <input 
                type="text" 
                readOnly
                className="w-full px-4 py-2 rounded-lg border border-gray-100 bg-gray-50 text-gray-500 font-medium"
                value={district || 'Select Area Manager First'}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700">Team Leader</label>
              <select 
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                value={teamLeader}
                onChange={(e) => setTeamLeader(e.target.value)}
              >
                <option value="">Select Team Leader</option>
                {TEAM_LEADERS.map(tl => (
                  <option key={tl} value={tl}>{tl}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Employees Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-bold text-gray-800">Employee Details</h2>
            <button 
              type="button" 
              onClick={addEmployee}
              className="p-1.5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            {employees.map((emp, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input 
                  type="text" 
                  placeholder="Employee Name"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                  value={emp.name}
                  onChange={(e) => updateEmployee(index, 'name', e.target.value)}
                />
                <input 
                  type="text" 
                  placeholder="ID"
                  className="w-24 px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                  value={emp.id}
                  onChange={(e) => updateEmployee(index, 'id', e.target.value)}
                />
                {employees.length > 1 && (
                  <button 
                    type="button"
                    onClick={() => removeEmployee(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Questions Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Evaluations & Observations</h2>
          
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <label className="block font-semibold text-gray-700">{q.text}</label>
              
              {q.type === 'text' && (
                <textarea 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none h-24"
                  onChange={(e) => handleResponseChange(q.id, e.target.value)}
                />
              )}

              {q.type === 'dropdown' && (
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-orange-500 outline-none"
                  onChange={(e) => handleResponseChange(q.id, e.target.value)}
                >
                  <option value="">Select Option</option>
                  {q.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              )}

              {q.type === 'radio' && (
                <div className="flex flex-wrap gap-4">
                  {q.options?.map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name={q.id} 
                        value={opt} 
                        className="text-orange-500 focus:ring-orange-500"
                        onChange={(e) => handleResponseChange(q.id, e.target.value)}
                      />
                      <span className="text-gray-600">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'checkbox' && (
                <div className="flex flex-wrap gap-4">
                  {q.options?.map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="rounded text-orange-500 focus:ring-orange-500"
                        onChange={(e) => {
                          const current = responses[q.id] || [];
                          const updated = e.target.checked 
                            ? [...current, opt] 
                            : current.filter((item: string) => item !== opt);
                          handleResponseChange(q.id, updated);
                        }}
                      />
                      <span className="text-gray-600">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Media Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 border-b pb-2">Image Evidence</h2>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 hover:bg-gray-50 transition-all">
            {image ? (
              <div className="relative">
                <img src={image} alt="Uploaded evidence" className="max-h-64 rounded-lg shadow-md" />
                <button 
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <CameraIcon className="w-12 h-12 text-gray-300 mb-4" />
                <p className="text-gray-400 text-sm mb-4">Upload or Capture Image</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-2 bg-orange-100 text-orange-600 rounded-lg font-bold hover:bg-orange-200 transition-all"
                >
                  Take Photo / Upload
                </button>
              </>
            )}
          </div>
        </div>

        {/* Submit Section */}
        <div className="pt-4">
          <button 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'}`}
          >
            {isSubmitting ? (
              <>
                <ArrowPathIcon className="w-6 h-6 animate-spin" />
                Submitting Response...
              </>
            ) : (
              'Submit Report'
            )}
          </button>
          <p className="text-center text-xs text-gray-400 mt-4">
            By submitting, this data will be stored in Google Sheets and sent to Admin email via PDF.
          </p>
        </div>
      </form>
    </div>
  );
};

export default GenericForm;

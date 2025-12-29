
import React from 'react';
import { 
  ClipboardDocumentCheckIcon, 
  UserGroupIcon, 
  ExclamationTriangleIcon, 
  CalendarDaysIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import { Category, Question } from './types';

export const BRANCHES = [
  'NBC Riyadh Main', 'NBC Jeddah Central', 'NBC Dammam Coast', 
  'NBC Al Khobar', 'NBC Mecca South', 'NBC Medina North'
];

export const SUPERVISORS = ['Ahmed Ali', 'Sarah Khan', 'Omar Hassan', 'Fatima Zahra'];

export const AREA_MANAGERS: Record<string, { district: string }> = {
  'Khalid Ibrahim': { district: 'Central' },
  'Mariam Saeed': { district: 'Western' },
  'Yousef Saleh': { district: 'Eastern' },
  'Noura Ahmad': { district: 'Southern' }
};

export const TEAM_LEADERS = ['TL-01 Samer', 'TL-02 Laila', 'TL-03 Kareem'];

export const ASSIGN_TO = ['TC-Sufyan', 'TC-Elmer'];
export const ACCOMPANIED_BY = ['FTS-Hashim Toba', 'FTS-Mohammad Ali Mubarak'];

export const DISTRICT_BRANCHES: Record<string, string[]> = {
  'Central': ['NBC Riyadh Main', 'NBC Diriyah'],
  'Western': ['NBC Jeddah Central', 'NBC Mecca South', 'NBC Medina North'],
  'Eastern': ['NBC Dammam Coast', 'NBC Al Khobar', 'NBC Jubail'],
  'Southern': ['NBC Abha', 'NBC Khamis Mushait']
};

export const SAMPLE_QUESTIONS: Record<string, Question[]> = {
  [Category.BranchVisit]: [
    { id: 'bv1', text: 'Is the branch clean and well-maintained?', type: 'radio', options: ['Yes', 'No', 'N/A'] },
    { id: 'bv2', text: 'Stock availability status', type: 'dropdown', options: ['Full', 'Partial', 'Critical'] },
    { id: 'bv3', text: 'Customer service observation', type: 'text' },
    { id: 'bv4', text: 'Staff uniforms in order?', type: 'checkbox', options: ['Clean', 'Ironed', 'Nametag'] }
  ],
  [Category.EmployeeEvaluation]: [
    { id: 'ee1', text: 'Punctuality', type: 'radio', options: ['Excellent', 'Good', 'Fair', 'Poor'] },
    { id: 'ee2', text: 'Technical Skills Proficiency', type: 'dropdown', options: ['Beginner', 'Intermediate', 'Expert'] },
    { id: 'ee3', text: 'Area of improvement', type: 'text' }
  ],
  [Category.ReportProblem]: [
    { id: 'rp1', text: 'Severity Level', type: 'radio', options: ['High', 'Medium', 'Low'] },
    { id: 'rp2', text: 'Problem Description', type: 'text' },
    { id: 'rp3', text: 'Immediate Action Taken', type: 'text' }
  ]
};

export const CATEGORY_CARDS = [
  { name: Category.BranchVisit, icon: <ClipboardDocumentCheckIcon className="w-8 h-8" />, color: 'bg-orange-500' },
  { name: Category.EmployeeEvaluation, icon: <UserGroupIcon className="w-8 h-8" />, color: 'bg-blue-500' },
  { name: Category.ReportProblem, icon: <ExclamationTriangleIcon className="w-8 h-8" />, color: 'bg-red-500' },
  { name: Category.Schedule, icon: <CalendarDaysIcon className="w-8 h-8" />, color: 'bg-green-500' },
  { name: Category.Dashboard, icon: <ChartBarIcon className="w-8 h-8" />, color: 'bg-purple-500' },
];

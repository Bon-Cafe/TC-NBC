
export enum Category {
  BranchVisit = 'Branch Visit',
  EmployeeEvaluation = 'Employee Evaluation',
  ReportProblem = 'Report Problem',
  Schedule = 'Schedule',
  Dashboard = 'Dashboard'
}

export interface User {
  username: string;
  role: string;
  avatar: string;
}

export interface EmployeeEntry {
  id: string;
  name: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'dropdown' | 'radio' | 'checkbox';
  options?: string[];
}

export interface FormSubmission {
  id: string;
  category: Category;
  timestamp: string;
  branchName: string;
  supervisor: string;
  areaManager: string;
  district: string;
  teamLeader: string;
  employees: EmployeeEntry[];
  responses: Record<string, any>;
  image?: string;
}

export interface ScheduleEntry {
  id: string;
  date: string;
  assignTo: string;
  accompaniedBy: string;
  district: string;
  branches: string[];
  purpose: string;
  approvedBy: string;
  timestamp: string;
}

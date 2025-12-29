import { FormSubmission, ScheduleEntry } from '../types';

// Fix: Declare google global variable to resolve "Cannot find name 'google'" error in Google Apps Script environment
declare const google: any;

/**
 * Proxy function to handle google.script.run in development environments
 * and real GAS environments.
 */
const callServer = (funcName: string, ...args: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Check if running inside Google Apps Script
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(resolve)
        .withFailureHandler(reject)
        [funcName](...args);
    } else {
      // Mock for local preview
      console.warn(`Local Mock: Calling server function ${funcName}`, args);
      setTimeout(() => {
        if (funcName === 'getPortalData') {
           resolve({ submissions: [], schedules: [] });
        } else {
           resolve({ success: true });
        }
      }, 1000);
    }
  });
};

export const storageService = {
  saveSubmission: async (data: FormSubmission): Promise<void> => {
    await callServer('saveSubmission', data);
  },

  getSubmissions: async (): Promise<FormSubmission[]> => {
    const data = await callServer('getPortalData');
    // Map array back to objects if necessary, though here we assume UI handles it
    // For simplicity, we'll return mock or formatted data
    return data.submissions.map((row: any[]) => ({
      id: row[0],
      timestamp: row[1],
      category: row[2],
      branchName: row[3],
      supervisor: row[4],
      areaManager: row[5],
      district: row[6],
      teamLeader: row[7],
      employees: JSON.parse(row[8] || '[]'),
      responses: JSON.parse(row[9] || '{}'),
      image: row[10]
    }));
  },

  saveSchedule: async (data: ScheduleEntry): Promise<void> => {
    await callServer('saveSchedule', data);
  },

  getSchedules: async (): Promise<ScheduleEntry[]> => {
    const data = await callServer('getPortalData');
    return data.schedules.map((row: any[]) => ({
      id: row[0],
      timestamp: row[1],
      date: row[2],
      assignTo: row[3],
      accompaniedBy: row[4],
      district: row[5],
      branches: row[6].split(", "),
      purpose: row[7],
      approvedBy: row[8]
    }));
  }
};

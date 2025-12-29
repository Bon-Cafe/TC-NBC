
import { FormSubmission, ScheduleEntry, Category } from '../types';

/**
 * Service to handle remote communication with Google Apps Script API
 */
const getApiUrl = () => localStorage.getItem('nbc_api_url') || '';

const callApi = async (action: string, payload?: any) => {
  const url = getApiUrl();
  if (!url) throw new Error("API URL not configured. Please go to settings.");

  // For POST actions (Submissions & Schedules)
  if (action === 'saveSubmission' || action === 'saveSchedule') {
    // Note: Google Apps Script Web Apps require 'no-cors' for simple POSTs from different domains,
    // which means we won't be able to read the response body, but the data will be sent.
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, payload })
    });
    return { success: true };
  }

  // For GET actions (Fetch all data)
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch data from GAS");
  return await response.json();
};

export const storageService = {
  saveSubmission: async (data: FormSubmission): Promise<void> => {
    await callApi('saveSubmission', data);
  },

  getSubmissions: async (): Promise<FormSubmission[]> => {
    const data = await callApi('getPortalData');
    if (!data || !data.submissions) return [];
    
    return data.submissions.map((row: any[]) => ({
      id: row[0],
      timestamp: row[1],
      category: row[2] as Category,
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
    await callApi('saveSchedule', data);
  },

  getSchedules: async (): Promise<ScheduleEntry[]> => {
    const data = await callApi('getPortalData');
    if (!data || !data.schedules) return [];

    return data.schedules.map((row: any[]) => ({
      id: row[0],
      timestamp: row[1],
      date: row[2],
      assignTo: row[3],
      accompaniedBy: row[4],
      district: row[5],
      branches: (row[6] || "").split(", "),
      purpose: row[7],
      approvedBy: row[8]
    }));
  }
};

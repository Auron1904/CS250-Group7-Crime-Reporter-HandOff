import { tokenManager } from './authApi';

const API_URL = 'http://localhost:8080/api/reports';

export const reportAPI = {
  // Create new report (requires authentication)
  createReport: async (reportData) => {
    const token = tokenManager.getToken();
    
    if (!token) {
      throw new Error('You must be logged in to submit a report');
    }
    
    console.log('Submitting report to:', API_URL);
    console.log('Report data:', reportData);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reportData)
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('Error response:', error);
      throw new Error(error || 'Failed to create report');
    }
    
    return response.json();
  },
  
  // Get all reports (public)
  getAllReports: async () => {
    console.log('Fetching all reports from:', API_URL);
    
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    
    return response.json();
  },
  
  // Get current user's reports (requires authentication)
  getMyReports: async () => {
    const token = tokenManager.getToken();
    
    if (!token) {
      throw new Error('You must be logged in');
    }
    
    const response = await fetch(`${API_URL}/my-reports`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch your reports');
    }
    
    return response.json();
  },
  
  // Get single report
  getReport: async (id) => {
    const response = await fetch(`${API_URL}/${id}`);
    
    if (!response.ok) {
      throw new Error('Report not found');
    }
    
    return response.json();
  }
};
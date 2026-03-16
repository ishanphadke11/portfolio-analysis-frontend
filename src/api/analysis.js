// Import our configured Axios client (base URL + JWT interceptor already set up)
import client from './client.js';

// Run a new Fama-French five-factor analysis against the user's current holdings.
// startDate and endDate are optional strings like "2022-01-01".
// If omitted, the backend defaults to endDate=today, startDate=3 years ago.
export async function runAnalysis(startDate, endDate) {
  // Build query params object — only include dates if they were provided
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  // POST to /analysis/run with no request body (null), but optional query params
  // e.g. /analysis/run?startDate=2022-01-01&endDate=2025-01-01
  const response = await client.post('/analysis/run', null, { params });
  return response.data;
}

// Fetch the list of all past analyses for the logged-in user
export async function getAnalysisHistory() {
  const response = await client.get('/analysis/history');
  return response.data;
}

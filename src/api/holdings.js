// Import our configured Axios client (already has the base URL and JWT interceptor)
// This means every call here automatically includes the Authorization: Bearer <token> header
import client from './client.js';

// Fetch all holdings for the logged-in user
export async function getHoldings() {
  const response = await client.get('/holdings');
  return response.data; // return just the data array, not the full Axios response object
}

// Add a new holding
// ticker: string e.g. "AAPL", quantity: number e.g. 10.5
// Returns the newly created holding: { id, ticker, quantity }
export async function addHolding(ticker, quantity) {
  const response = await client.post('/holdings', { ticker, quantity });
  return response.data;
}

// Update an existing holding by its ID
// id: the holding's database ID, ticker: updated ticker, quantity: updated quantity
// Returns the updated holding: { id, ticker, quantity }
export async function updateHolding(id, ticker, quantity) {
  const response = await client.put(`/holdings/${id}`, { ticker, quantity });
  return response.data;
}

// Delete a holding by its ID
// Returns nothing — the backend sends 204 No Content on success
export async function deleteHolding(id) {
  await client.delete(`/holdings/${id}`);
}

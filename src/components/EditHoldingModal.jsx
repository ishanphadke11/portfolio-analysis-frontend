// useState — track form field values, loading, and errors
import { useState } from 'react';

// API function for updating a holding
import { updateHolding } from '../api/holdings.js';

// Ticker autocomplete input
import TickerAutocomplete from './TickerAutocomplete.jsx';

// Props received from Dashboard:
// - holding: the existing holding object { id, ticker, quantity }
// - onClose: close the modal without saving
// - onUpdate: called with the updated holding so Dashboard can refresh the row
function EditHoldingModal({ holding, onClose, onUpdate }) {
  // Pre-fill the form with the existing values
  const [ticker, setTicker] = useState(holding.ticker);
  const [quantity, setQuantity] = useState(holding.quantity);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Send the updated values to the backend using the holding's existing ID
      const updated = await updateHolding(holding.id, ticker, parseFloat(quantity));

      // Pass the updated holding back to Dashboard to refresh the table row
      onUpdate(updated);

      // Close the modal
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update holding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Dark overlay covering the full screen
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      {/* Modal card */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Edit Holding</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Ticker field with autocomplete */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticker Symbol
            </label>
            <TickerAutocomplete value={ticker} onChange={setTicker} />
          </div>

          {/* Quantity field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              required
              min="0.0001"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditHoldingModal;

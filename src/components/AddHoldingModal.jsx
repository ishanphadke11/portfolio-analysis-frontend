// useState — track form field values, loading, and errors
import { useState } from 'react';

// Our API function for adding a holding
import { addHolding } from '../api/holdings.js';

// The ticker autocomplete input component
import TickerAutocomplete from './TickerAutocomplete.jsx';

// Props received from Dashboard:
// - onClose: function to call when the modal should be closed
// - onAdd: function to call with the new holding after it's successfully added
function AddHoldingModal({ onClose, onAdd }) {
  // The ticker the user has typed/selected (e.g. "AAPL")
  const [ticker, setTicker] = useState('');

  // The quantity the user entered
  const [quantity, setQuantity] = useState('');

  // Error message if the API call fails
  const [error, setError] = useState(null);

  // True while the API call is in progress
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // Call the API — parseFloat converts the quantity string to a number
      const newHolding = await addHolding(ticker, parseFloat(quantity));

      // Pass the newly created holding back to Dashboard so it can add it to the table
      onAdd(newHolding);

      // Close the modal
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add holding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // The dark overlay behind the modal
    // "fixed inset-0" = covers the entire screen
    // flex items-center justify-center = centers the modal card
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      {/* The modal card */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">

        {/* Header row with title and close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Add Holding</h2>

          {/* × button to close without saving */}
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

          {/* Ticker field — uses the autocomplete component */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ticker Symbol
            </label>
            {/* We pass "value" and "onChange" down to TickerAutocomplete as props */}
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
              min="0.0001"       // prevent zero or negative quantities
              step="any"         // allow decimals like 1.5
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g. 10.5"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-2">
            {/* Cancel — closes modal without saving */}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition"
            >
              {submitting ? 'Adding...' : 'Add Holding'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddHoldingModal;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHoldings, deleteHolding } from '../api/holdings.js';
import { runAnalysis } from '../api/analysis.js';
import AddHoldingModal from '../components/AddHoldingModal.jsx';
import EditHoldingModal from '../components/EditHoldingModal.jsx';

function Dashboard() {
  // The list of holdings fetched from the backend
  const [holdings, setHoldings] = useState([]);

  // True while the initial holdings fetch is in progress
  const [loading, setLoading] = useState(true);

  // Error message if the initial fetch fails
  const [error, setError] = useState(null);

  // Controls whether the Add Holding modal is open
  const [showAddModal, setShowAddModal] = useState(false);

  // The holding currently being edited (full object), or null if no edit modal is open
  const [editingHolding, setEditingHolding] = useState(null);

  // The ID of the holding waiting for delete confirmation, or null if none
  const [deletingId, setDeletingId] = useState(null);

  // True while the analysis API call is in progress
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Error message if the analysis call fails
  const [analysisError, setAnalysisError] = useState(null);

  // useNavigate lets us redirect to /results after a successful analysis
  const navigate = useNavigate();

  // Fetch holdings once when the page first loads
  useEffect(() => {
    async function fetchHoldings() {
      try {
        const data = await getHoldings();
        setHoldings(data);
      } catch (err) {
        setError('Failed to load holdings.');
      } finally {
        setLoading(false);
      }
    }
    fetchHoldings();
  }, []);

  // Called by AddHoldingModal — appends the new holding to the table
  const handleHoldingAdded = (newHolding) => {
    setHoldings((prev) => [...prev, newHolding]);
  };

  // Called by EditHoldingModal — replaces the old holding in the list with the updated one
  const handleHoldingUpdated = (updatedHolding) => {
    setHoldings((prev) =>
      // .map() goes through each holding — if it's the one we edited, swap it; otherwise keep it
      prev.map((h) => (h.id === updatedHolding.id ? updatedHolding : h))
    );
  };

  // Called when the user clicks "Run Analysis"
  const handleRunAnalysis = async () => {
    setAnalysisError(null);
    setAnalysisLoading(true);

    try {
      const results = await runAnalysis();

      // Navigate to /results and pass the analysis data via React Router's state.
      // The Results page reads this with useLocation().state
      navigate('/results', { state: { results } });
    } catch (err) {
      setAnalysisError(err.response?.data?.error || 'Analysis failed. Please try again.');
    } finally {
      setAnalysisLoading(false);
    }
  };

  // Called when the user confirms deletion
  const handleDeleteConfirm = async (id) => {
    try {
      await deleteHolding(id);

      // Remove the deleted holding from the list
      setHoldings((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      // If deletion fails, just cancel the confirmation state
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading holdings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">

      {/* Add Holding modal */}
      {showAddModal && (
        <AddHoldingModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleHoldingAdded}
        />
      )}

      {/* Edit Holding modal — only rendered when a holding is selected for editing */}
      {editingHolding && (
        <EditHoldingModal
          holding={editingHolding}
          onClose={() => setEditingHolding(null)}
          onUpdate={handleHoldingUpdated}
        />
      )}

      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Holdings</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
          >
            + Add Holding
          </button>
          {/* Run Analysis — calls the backend and navigates to /results on success */}
          <button
            onClick={handleRunAnalysis}
            disabled={analysisLoading || holdings.length === 0}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 transition text-sm"
          >
            {analysisLoading ? 'Running...' : 'Run Analysis'}
          </button>
        </div>
      </div>

      {/* Analysis error banner — only shown if the analysis API call failed */}
      {analysisError && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
          {analysisError}
        </div>
      )}

      {/* Empty state */}
      {holdings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No holdings yet.</p>
          <p className="text-gray-400 text-sm mt-1">Click "Add Holding" to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Ticker</th>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Quantity</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-6 py-4 font-medium text-gray-900">{holding.ticker}</td>
                  <td className="px-6 py-4 text-gray-600">{holding.quantity}</td>
                  <td className="px-6 py-4 text-right">

                    {/* Show inline delete confirmation if this row's delete was clicked */}
                    {deletingId === holding.id ? (
                      <span className="flex items-center justify-end gap-2">
                        <span className="text-gray-500 text-sm">Are you sure?</span>
                        {/* Confirm deletion */}
                        <button
                          onClick={() => handleDeleteConfirm(holding.id)}
                          className="text-red-600 hover:underline text-sm font-medium"
                        >
                          Yes
                        </button>
                        {/* Cancel — go back to normal row */}
                        <button
                          onClick={() => setDeletingId(null)}
                          className="text-gray-500 hover:underline text-sm"
                        >
                          No
                        </button>
                      </span>
                    ) : (
                      /* Normal action buttons */
                      <span className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => setEditingHolding(holding)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingId(holding.id)}
                          className="text-red-500 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

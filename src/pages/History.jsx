import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalysisHistory } from '../api/analysis.js';

// Formats the analysisDate string into something readable
function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
}

function History() {
  // List of past analysis results
  const [history, setHistory] = useState([]);

  // True while fetching from the backend
  const [loading, setLoading] = useState(true);

  // Error message if the fetch fails
  const [error, setError] = useState(null);

  // useNavigate lets us navigate to /results when a row is clicked
  const navigate = useNavigate();

  // Fetch history once when the page first loads
  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getAnalysisHistory();
        setHistory(data);
      } catch (err) {
        setError('Failed to load analysis history.');
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // When a row is clicked, pass that result to the Results page via router state.
  // The Results page already handles null tStats gracefully for historical results.
  const handleRowClick = (result) => {
    navigate('/results', { state: { results: result } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading history...</p>
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analysis History</h1>

      {/* Empty state */}
      {history.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No analyses run yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Run an analysis from the Dashboard to see it here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-600">Date</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">Alpha</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">R²</th>
                <th className="text-right px-6 py-3 font-medium text-gray-600">Market β</th>
              </tr>
            </thead>
            <tbody>
              {history.map((result) => (
                // Clicking a row navigates to /results with this result's data
                <tr
                  key={result.id}
                  onClick={() => handleRowClick(result)}
                  className="border-b border-gray-100 last:border-0 cursor-pointer hover:bg-blue-50 transition"
                >
                  <td className="px-6 py-4 text-gray-700">{formatDate(result.analysisDate)}</td>

                  {/* Alpha — green if positive, red if negative */}
                  <td className={`px-6 py-4 text-right font-mono font-medium
                    ${result.alpha >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {result.alpha >= 0 ? '+' : ''}{parseFloat(result.alpha).toFixed(4)}
                  </td>

                  {/* R² as a percentage */}
                  <td className="px-6 py-4 text-right text-gray-700">
                    {(result.rSquared * 100).toFixed(1)}%
                  </td>

                  {/* Market beta */}
                  <td className="px-6 py-4 text-right font-mono text-gray-700">
                    {parseFloat(result.betaMkt).toFixed(4)}
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

export default History;

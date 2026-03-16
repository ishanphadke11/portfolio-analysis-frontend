import { useLocation, Link } from 'react-router-dom';

const FACTORS = [
  {
    field: 'betaMkt',
    tStatField: 'mkt',
    variable: 'Mkt-RF',
    label: 'Market',
    description: 'Sensitivity to overall stock market movements.',
    positiveLabel: 'Moves with the market.',
    negativeLabel: 'Moves against the market.',
  },
  {
    field: 'betaSmb',
    tStatField: 'smb',
    variable: 'SMB',
    variableFull: 'Small Minus Big',
    label: 'Size',
    description: 'Tilt toward small-cap vs large-cap stocks.',
    positiveLabel: 'Tilted toward smaller companies.',
    negativeLabel: 'Tilted toward larger companies.',
  },
  {
    field: 'betaHml',
    tStatField: 'hml',
    variable: 'HML',
    variableFull: 'High Minus Low',
    label: 'Value',
    description: 'Tilt toward undervalued (value) vs high-growth stocks.',
    positiveLabel: 'Tilted toward value stocks.',
    negativeLabel: 'Tilted toward growth stocks.',
  },
  {
    field: 'betaRmw',
    tStatField: 'rmw',
    variable: 'RMW',
    variableFull: 'Robust Minus Weak',
    label: 'Profitability',
    description: 'Tilt toward highly profitable vs less profitable companies.',
    positiveLabel: 'Tilted toward profitable companies.',
    negativeLabel: 'Tilted toward less profitable companies.',
  },
  {
    field: 'betaCma',
    tStatField: 'cma',
    variable: 'CMA',
    variableFull: 'Conservative Minus Aggressive',
    label: 'Investment',
    description: 'Tilt toward conservative vs aggressively investing companies.',
    positiveLabel: 'Tilted toward conservative spenders.',
    negativeLabel: 'Tilted toward aggressive spenders.',
  },
];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString();
}

function Results() {
  const location = useLocation();
  const results = location.state?.results;

  if (!results) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">No Results Yet</h1>
        <p className="text-gray-500 mb-6">Run an analysis from the Dashboard to see your results here.</p>
        <Link to="/dashboard" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
          <p className="text-sm text-gray-400 mt-1">{formatDate(results.analysisDate)}</p>
        </div>
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      {/* Factor cards */}
      <div className="space-y-2">
        {FACTORS.map((factor) => {
          const value = results[factor.field];
          const tStat = results.tStats?.[factor.tStatField];
          const isPositive = value >= 0;

          return (
            <div key={factor.field} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">

                {/* Left: label, variable name, description */}
                <div className="flex-1 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{factor.label}</span>
                    {/* Variable name badge */}
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-mono">
                      {factor.variable}
                    </span>
                    {factor.variableFull && (
                      <span className="text-xs text-gray-400">{factor.variableFull}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">{factor.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {isPositive ? factor.positiveLabel : factor.negativeLabel}
                  </p>
                </div>

                {/* Right: value and t-stat */}
                <div className="text-right shrink-0">
                  <p className={`text-lg font-bold font-mono ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{parseFloat(value).toFixed(4)}
                  </p>
                  {tStat !== undefined && tStat !== null && (
                    <p className="text-xs text-gray-400 mt-0.5">t: {parseFloat(tStat).toFixed(2)}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {results.tStats && (
        <p className="text-xs text-gray-400 mt-3">
          t-stat above ±2.0 indicates the exposure is statistically significant.
        </p>
      )}
    </div>
  );
}

export default Results;

import { useLocation, Link } from 'react-router-dom';

// Each factor definition includes:
// - field: the key in the API response
// - tStatField: the key inside tStats
// - label: short display name
// - what: plain English explanation of what this factor measures
// - positive: what a positive value means for your portfolio
// - negative: what a negative value means for your portfolio
const FACTORS = [
  {
    field: 'betaMkt',
    tStatField: 'mkt',
    label: 'Market Exposure',
    what: 'Measures how much your portfolio moves with the overall stock market.',
    positive: 'Your portfolio tends to rise and fall with the market. A value of 1.0 means it moves exactly with the market. Above 1.0 means it swings more than the market (higher risk, higher potential reward).',
    negative: 'Your portfolio tends to move opposite to the market, which is rare for a typical stock portfolio.',
  },
  {
    field: 'betaSmb',
    tStatField: 'smb',
    label: 'Size Exposure',
    what: 'Measures whether your portfolio leans toward small companies or large companies.',
    positive: 'Your portfolio is tilted toward smaller companies. Small companies historically earn higher returns over time, but are more volatile.',
    negative: 'Your portfolio is tilted toward larger, more established companies (like Apple or Microsoft). These tend to be more stable.',
  },
  {
    field: 'betaHml',
    tStatField: 'hml',
    label: 'Value Exposure',
    what: 'Measures whether your portfolio leans toward "value" stocks (cheap, undervalued) or "growth" stocks (expensive, fast-growing).',
    positive: 'Your portfolio leans toward value stocks — companies that appear underpriced relative to their earnings. Think traditional industries like banking or energy.',
    negative: 'Your portfolio leans toward growth stocks — companies priced high because investors expect strong future growth. Think tech companies like Nvidia or Tesla.',
  },
  {
    field: 'betaRmw',
    tStatField: 'rmw',
    label: 'Profitability Exposure',
    what: 'Measures whether your portfolio favours highly profitable companies over less profitable ones.',
    positive: 'Your portfolio is tilted toward companies with strong, consistent profits. These tend to be more resilient during downturns.',
    negative: 'Your portfolio includes companies with thinner profit margins or that are not yet profitable. These can be higher risk but may have higher upside.',
  },
  {
    field: 'betaCma',
    tStatField: 'cma',
    label: 'Investment Style Exposure',
    what: 'Measures whether your portfolio favours conservative companies (low spending) or aggressive ones (high spending on growth).',
    positive: 'Your portfolio favours companies that spend conservatively — returning cash to shareholders rather than reinvesting aggressively.',
    negative: 'Your portfolio favours companies that invest heavily in growth — building new capacity, R&D, or acquisitions. Higher risk, but potentially higher reward.',
  },
  {
    field: 'alpha',
    tStatField: 'alpha',
    label: 'Alpha (Skill)',
    what: 'The portion of your portfolio\'s return that cannot be explained by any of the five factors above. This is sometimes called "stock-picking skill".',
    positive: 'Your portfolio generated returns above and beyond what the market factors would predict. This suggests your stock selection added value.',
    negative: 'Your portfolio underperformed what the factors would predict. This could be due to bad timing, high fees, or simply bad luck.',
  },
];

// Returns a plain English strength label based on the absolute value of a beta
function getStrength(value) {
  const abs = Math.abs(value);
  if (abs < 0.05) return { label: 'Negligible', color: 'text-gray-400' };
  if (abs < 0.2)  return { label: 'Weak',       color: 'text-yellow-500' };
  if (abs < 0.5)  return { label: 'Moderate',   color: 'text-blue-500' };
  return            { label: 'Strong',     color: 'text-purple-600' };
}

// Returns an R² interpretation in plain English
function interpretRSquared(rSquared) {
  const pct = rSquared * 100;
  if (pct >= 80) return `${pct.toFixed(1)}% — The five factors explain almost all of your portfolio's returns. Your returns are very well described by broad market forces.`;
  if (pct >= 60) return `${pct.toFixed(1)}% — The five factors explain most of your returns. A small portion comes from other influences.`;
  if (pct >= 40) return `${pct.toFixed(1)}% — The five factors explain a moderate portion of your returns. Other influences play a meaningful role.`;
  return `${pct.toFixed(1)}% — The five factors explain only a small part of your returns. Your portfolio may be driven by stock-specific events rather than broad market forces.`;
}

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
        <Link
          to="/dashboard"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
          <p className="text-sm text-gray-400 mt-1">Run on {formatDate(results.analysisDate)}</p>
        </div>
        <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* R-Squared card */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-gray-900">Model Fit (R²)</p>
            <p className="text-xs text-gray-400 mt-0.5 mb-2">How well do the five factors explain your portfolio?</p>
            <p className="text-sm text-gray-600">{interpretRSquared(results.rSquared)}</p>
          </div>
          <span className="text-3xl font-bold text-gray-900 ml-6 shrink-0">
            {(results.rSquared * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Factor cards */}
      <div className="space-y-3">
        {FACTORS.map((factor) => {
          const value = results[factor.field];
          const tStat = results.tStats?.[factor.tStatField];
          const strength = getStrength(value);
          const isPositive = value >= 0;
          const interpretation = isPositive ? factor.positive : factor.negative;

          return (
            <div key={factor.field} className="bg-white border border-gray-200 rounded-lg p-5">

              {/* Top row: label, value, strength badge */}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">{factor.label}</p>
                  {/* Plain English "what is this" */}
                  <p className="text-xs text-gray-400 mt-0.5">{factor.what}</p>
                </div>

                <div className="flex flex-col items-end ml-4 shrink-0">
                  {/* The numeric value */}
                  <span className={`text-xl font-bold font-mono ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                    {isPositive ? '+' : ''}{parseFloat(value).toFixed(4)}
                  </span>
                  {/* Strength label */}
                  <span className={`text-xs font-medium mt-0.5 ${strength.color}`}>
                    {strength.label} {isPositive ? 'positive' : 'negative'}
                  </span>
                  {/* t-stat if available */}
                  {tStat !== undefined && tStat !== null && (
                    <span className="text-xs text-gray-400 mt-1">t-stat: {parseFloat(tStat).toFixed(2)}</span>
                  )}
                </div>
              </div>

              {/* Plain English interpretation of this portfolio's specific value */}
              <p className="text-sm text-gray-600 mt-2 pt-2 border-t border-gray-100">
                {interpretation}
              </p>
            </div>
          );
        })}
      </div>

      {/* t-stat footnote */}
      {results.tStats && (
        <p className="text-xs text-gray-400 mt-4">
          t-stat measures statistical confidence. A value above 2.0 or below −2.0 means the exposure is unlikely to be due to chance.
        </p>
      )}
    </div>
  );
}

export default Results;

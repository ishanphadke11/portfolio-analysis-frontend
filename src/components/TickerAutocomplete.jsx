// useState — track the text the user is typing and whether the dropdown is visible
// useRef — lets us reference the component's DOM element to detect clicks outside it
// useEffect — used to add/remove the outside-click listener
import { useState, useRef, useEffect } from 'react';

// Import the static list of tickers bundled with the app
import tickers from '../data/tickers.json';

// Props this component receives from its parent (AddHoldingModal):
// - value: the current ticker value (controlled by the parent)
// - onChange: function to call when the user selects or types a ticker
function TickerAutocomplete({ value, onChange }) {
  // Whether to show the dropdown list
  const [showDropdown, setShowDropdown] = useState(false);

  // The filtered list of tickers matching what the user has typed
  const [suggestions, setSuggestions] = useState([]);

  // useRef creates a reference to the outer <div> so we can detect clicks outside it
  const containerRef = useRef(null);

  // Runs whenever the user types in the input
  const handleInputChange = (e) => {
    const typed = e.target.value;

    // Tell the parent the value changed (so it can store it in its own state)
    onChange(typed);

    if (typed.length === 0) {
      // If the input is empty, hide the dropdown
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Filter tickers — match on symbol OR company name (case-insensitive)
    const lower = typed.toLowerCase();
    const matches = tickers.filter(
      (t) =>
        t.symbol.toLowerCase().startsWith(lower) ||
        t.name.toLowerCase().includes(lower)
    );

    // Only show the first 8 matches to keep the dropdown manageable
    setSuggestions(matches.slice(0, 8));
    setShowDropdown(matches.length > 0);
  };

  // Called when the user clicks a suggestion in the dropdown
  const handleSelect = (ticker) => {
    // Tell the parent the selected symbol (e.g. "AAPL")
    onChange(ticker.symbol);

    // Hide the dropdown
    setSuggestions([]);
    setShowDropdown(false);
  };

  // Close the dropdown if the user clicks anywhere outside this component
  useEffect(() => {
    const handleClickOutside = (e) => {
      // containerRef.current is the outer <div> of this component
      // "contains" checks if the click happened inside it
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    // Listen for any click on the page
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup — remove the listener when this component is removed from the screen
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    // "relative" positioning allows the dropdown to be positioned below this input
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder="e.g. AAPL"
        required
        // Convert input to uppercase as the user types (tickers are always uppercase)
        onInput={(e) => { e.target.value = e.target.value.toUpperCase(); }}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Dropdown — only shown when showDropdown is true */}
      {showDropdown && (
        // "absolute" positions the dropdown relative to the parent "relative" div
        // top-full = directly below the input, z-10 = appears above other elements
        <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((ticker) => (
            <li
              key={ticker.symbol}
              // onMouseDown fires before onBlur so the click registers before dropdown closes
              onMouseDown={() => handleSelect(ticker)}
              className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
            >
              {/* Symbol on the left in bold */}
              <span className="font-medium text-gray-900">{ticker.symbol}</span>

              {/* Company name on the right in muted text */}
              <span className="text-gray-400 text-sm truncate ml-4">{ticker.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TickerAutocomplete;

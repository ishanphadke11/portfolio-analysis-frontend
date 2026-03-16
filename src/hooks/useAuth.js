// useContext lets us read data from a React context
import { useContext } from 'react';

// Import the AuthContext object we exported from AuthContext.jsx
import { AuthContext } from '../context/AuthContext.jsx';

// Custom hook — any component calls useAuth() to get token, email, login, logout, etc.
// Keeping this in its own file fixes a Vite Fast Refresh warning that occurs when
// a file mixes React component exports (AuthProvider) with non-component exports (useAuth)
function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;

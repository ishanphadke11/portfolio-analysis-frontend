// useState — tracks what the user types into the form fields
import { useState } from 'react';

// useNavigate — redirects user to another page after successful registration
// Link — lets users click to go to login page without a full page reload
import { useNavigate, Link } from 'react-router-dom';

// useAuth — gives us access to the register function from AuthContext
import useAuth from '../hooks/useAuth.js';

function Register() {
  // State for each form field — starts empty
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // extra field to catch typos

  // State for showing error messages (null = no error shown)
  const [error, setError] = useState(null);

  // State to disable the button while the API call is in progress
  const [submitting, setSubmitting] = useState(false);

  // Get the register function from our AuthContext
  const { register } = useAuth();

  // Get the navigate function to redirect after successful registration
  const navigate = useNavigate();

  // Runs when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      await register(email, password);
      navigate('/dashboard');
    } catch (error) {
      const data = error.response?.data;
      if (data?.error) {
        setError(data.error);
      } else if (data && typeof data === 'object') {
        // validation errors come back as {field: message} pairs
        setError(Object.values(data).join('. '));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Centers the card vertically and horizontally on the page
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      {/* White card that holds the form */}
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">

        {/* Page title */}
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Create your account
        </h1>

        {/* Error banner — only rendered if error is not null */}
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        {/* space-y-4 adds vertical spacing between form fields automatically */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"                           // browser validates email format
              required                               // won't submit if empty
              value={email}                          // controlled by state
              onChange={(e) => setEmail(e.target.value)} // update state on each keystroke
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"                        // hides characters as the user types
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm password field — catches typos before sending to the API */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit button — disabled and shows different text while submitting */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-blue-400 transition"
          >
            {submitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Link back to login for users who already have an account */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

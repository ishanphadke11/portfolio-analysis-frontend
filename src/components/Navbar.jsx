import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

function Navbar() {
    const { email, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-xl font-bold">
                    Portfolio Analysis
                </Link>
                <Link to="/dashboard" className="hover:text-gray-300 text-sm">
                    Dashboard
                </Link>
                <Link to="/results" className="hover:text-gray-300 text-sm">
                    Results
                </Link>
                <Link to="/history" className="hover:text-gray-300 text-sm">
                    History
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {/* Show the logged-in user's email in a muted colour */}
                <span className="text-gray-400 text-sm">{email}</span>

                {/* Logout button — calls handleLogout which clears the token and redirects */}
                <button
                    onClick={handleLogout}
                    className="text-sm border border-gray-500 px-3 py-1 rounded hover:bg-gray-700 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;

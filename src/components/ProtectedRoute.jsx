import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function ProtectedRoute() {
    const { isLoggedIn, loading } = useAuth();
    if (loading) {
        return null;
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/login"  replace/>;
}

export default ProtectedRoute;
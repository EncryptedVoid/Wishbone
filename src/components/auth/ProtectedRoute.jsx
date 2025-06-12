import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading while auth state is being determined
  if (loading) {
    return <LoadingSpinner />;
  }

  // Only redirect if we're certain the user is not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
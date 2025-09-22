import { Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import { useAuth } from '../auth/hooks/authcontext.provider';

// A wrapper for auth routes (login, register) that should only be accessible when not authenticated
const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const loginRoutes = [
  {
    path: '/login',
    element: (
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    ),
  },
];

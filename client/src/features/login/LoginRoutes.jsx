import { Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import { isAuthenticated } from '../auth/api/authApi';

// A wrapper for auth routes (login, register) that should only be accessible when not authenticated
const AuthRoute = ({ children }) => {
  if (isAuthenticated()) {
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

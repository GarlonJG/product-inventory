import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ redirectTo = "/login" }) {
  // Check for auth token in localStorage
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

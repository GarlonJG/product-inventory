import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/authcontext.provider";

function ProtectedRoute({ children, redirectTo = "/login" }) {
  const { accessToken, user } = useAuth();
  if (!accessToken && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;

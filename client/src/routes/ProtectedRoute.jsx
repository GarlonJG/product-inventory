import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/authcontext.provider";
import { useLocation } from "react-router-dom";

function ProtectedRoute({ allowedRoles, children, redirectTo = "/login" }) {
  const { accessToken, user } = useAuth();
  if (!accessToken && !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles?.includes(user.role)) {
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />
  }

  return children;
}

export default ProtectedRoute;

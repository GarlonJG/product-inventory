import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ redirectTo = "/login" }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) return <Navigate to={redirectTo} />;

  return <Outlet />;
}

export default ProtectedRoute;
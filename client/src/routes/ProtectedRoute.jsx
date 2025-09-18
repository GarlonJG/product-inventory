import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux"; // assuming auth state is in Redux

function ProtectedRoute({ redirectTo = "/login" }) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isLoggedIn) return <Navigate to={redirectTo} />;

  return <Outlet />; // renders child routes
}

export default ProtectedRoute;
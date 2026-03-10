import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isLoggedIn = !!localStorage.getItem("accessToken"); // Vérifie si token existe
  return isLoggedIn ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
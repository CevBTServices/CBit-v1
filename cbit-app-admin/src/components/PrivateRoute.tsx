import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

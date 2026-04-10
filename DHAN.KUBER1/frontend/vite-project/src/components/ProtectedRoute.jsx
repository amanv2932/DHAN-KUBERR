import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("dhankuber_token");
  const user = localStorage.getItem("dhankuber_user");
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}

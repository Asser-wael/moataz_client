import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { userData: user, isLoading } = useSelector(
    (state) => state.profile
  );

  if (isLoading) return <div>Loading...</div>;

  if (user) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "user") return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
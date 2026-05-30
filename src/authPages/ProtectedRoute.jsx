import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loading from "../components/loading";

const ProtectedRoute = ({ children, role }) => {
  const { userData: user, isLoading } = useSelector(
    (state) => state.profile
  );

  if (isLoading) return <Loading/>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;

  }

  return children;
};

export default ProtectedRoute;
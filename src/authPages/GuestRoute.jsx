import { useSelector } from "react-redux";

const GuestRoute = ({ children }) => {
  const { isLoading } = useSelector((state) => state.profile);

  if (isLoading) return <div>Loading...</div>;

  return children;
};

export default GuestRoute;
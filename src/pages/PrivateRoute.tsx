import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ element }) => {
  const { signed } = useAuth();

  return signed ? element : <Navigate to="/login" />;
};
export default PrivateRoute;

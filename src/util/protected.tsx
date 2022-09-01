import { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

type Props = {
  usuario: Usuario | null;
  redirectPath: string;
  children: ReactNode;
};

const ProtectedRoute = ({
  usuario,
  redirectPath = "/landing",
  children,
}: Props) => {
  if (!usuario) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;

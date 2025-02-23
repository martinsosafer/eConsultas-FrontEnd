import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminRoute = ({ children }: ProtectedRouteProps) => {
  const { personaData, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  const isAdmin = personaData?.credenciales.roles.some(r => [1, 3].includes(r.id));
  if (!isAdmin) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};
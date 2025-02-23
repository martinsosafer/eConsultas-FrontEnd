import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const SuperAdminRoute = ({ children }: ProtectedRouteProps) => {
  const { personaData, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  
  const isSuperAdmin = personaData?.credenciales.roles.some(r => r.id === 3);
  if (!isSuperAdmin) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
};
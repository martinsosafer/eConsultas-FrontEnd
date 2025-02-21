import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import LoadingSpinner from "@/components/ui/loading-spinner";

export const AdminRoute = () => {
  const { personaData, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const hasAccess = personaData?.credenciales?.roles?.some(role => 
    ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"].includes(role.nombre)
  );

  if (!hasAccess) return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};
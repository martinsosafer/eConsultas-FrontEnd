import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import LoadingSpinner from "@/components/ui/loading-spinner";

export const ProtectedProfile = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};
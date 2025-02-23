import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const OwnerRoute = ({ children }: ProtectedRouteProps) => {
  const { personaData, isLoading } = useAuth();
  const { username } = useParams<{ username: string }>();

  if (isLoading) return <LoadingSpinner />;
  if (!personaData || decodeURIComponent(username!) !== personaData.credenciales.email) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const CheckProfileAccess = ({ children }: ProtectedRouteProps) => {
  const { personaData, isLoading } = useAuth();
  const { username } = useParams<{ username: string }>();

  if (isLoading) return <LoadingSpinner />;
  
  const isOwner = decodeURIComponent(username!) === personaData?.credenciales.email;
  const isAdmin = personaData?.credenciales.roles.some(r => [1, 3].includes(r.id));
  
  if (!isOwner && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
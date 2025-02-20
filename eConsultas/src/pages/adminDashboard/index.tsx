import AdminDashboard from "./dasboardView/AdminDashboard";

import { Navigate } from "react-router-dom"; 
import { useAuth } from "@/context/AuthProvider";

function DashboardAdminPage() {
  const { personaData, isAuthenticated, isLoading } = useAuth();

  // 1. Handle loading state first
  if (isLoading) {
    return <div>Loading authentication state...</div>;
  }

  // 2. Check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Check SuperAdmin status AFTER confirming auth
  const isSuperAdmin = personaData?.credenciales?.roles?.some(
    (role) => role.nombre === "ROLE_SUPER_ADMIN"
  );

  console.log("Super Admin Status:", isSuperAdmin);
  console.log("Full Credenciales:", personaData?.credenciales);

  // 4. Handle role check
  if (!isSuperAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 5. Render dashboard only when all conditions met
  return <AdminDashboard />;
}
export default DashboardAdminPage;

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types/auth";

interface ProtectedRouteProps {
  /** Si renseigné, restreint l'accès aux rôles listés. */
  roles?: Role[];
  /** Route de redirection en cas de rôle insuffisant. */
  fallback?: string;
}

export default function ProtectedRoute({ roles, fallback = "/app" }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-muted-foreground text-sm">
        Chargement…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}

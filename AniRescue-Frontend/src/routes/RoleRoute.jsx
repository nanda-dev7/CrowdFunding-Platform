import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RoleRoute({ roles = [] }) {
  const user = useAuthStore((state) => state.user);
  if (!roles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
  return <Outlet />;
}

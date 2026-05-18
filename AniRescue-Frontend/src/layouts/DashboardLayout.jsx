import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, HeartHandshake, ShieldCheck } from "lucide-react";
import { useAuthStore } from "../store/authStore";

export default function DashboardLayout() {
  const user = useAuthStore((state) => state.user);
  const links = [
    { to: "/dashboard/donor", label: "Donor", icon: HeartHandshake, roles: ["donor", "campaigner", "admin"] },
    { to: "/dashboard/campaigner", label: "Campaigner", icon: BarChart3, roles: ["campaigner", "admin"] },
    { to: "/dashboard/admin", label: "Admin", icon: ShieldCheck, roles: ["admin"] },
  ].filter((link) => link.roles.includes(user?.role));
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-gradient-to-br from-cream via-white to-sage/40">
      <div className="border-b border-bark/10 bg-white/60">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${isActive ? "bg-moss text-white" : "bg-white text-bark"}`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
      <Outlet />
    </main>
  );
}

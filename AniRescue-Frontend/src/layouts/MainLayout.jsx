import { Link, NavLink, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, HeartHandshake, LayoutDashboard, LogOut, Menu, PawPrint, Search, User, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../hooks/useNotifications";
import Button from "../components/common/Button";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Campaigns", to: "/campaigns" },
  { label: "Urgent Cases", to: "/campaigns?urgency=urgent" },
];

function dashboardPath(role) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "campaigner") return "/dashboard/campaigner";
  return "/dashboard/donor";
}

function NavLinks({ onClick }) {
  return navItems.map((item) => (
    <NavLink
      key={item.to}
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `rounded-full px-4 py-2 text-sm font-bold transition ${isActive ? "text-coral" : "text-bark/70 hover:bg-white hover:text-ink"}`
      }
    >
      {item.label}
    </NavLink>
  ));
}

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markRead } = useNotifications();

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-[#f7efe3] text-ink">
      <header className="sticky top-0 z-40 border-b border-white/50 bg-cream/75 backdrop-blur-xl">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-2xl font-black tracking-tighter text-coral" aria-label="AniRescue home">
            AniRescue
          </Link>

          <div className="hidden items-center rounded-full border border-bark/10 bg-white/70 p-1 shadow-sm lg:flex">
            <NavLinks />
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link to="/campaigns" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-bark shadow-sm" aria-label="Search campaigns">
              <Search size={19} />
            </Link>
            {isAuthenticated && (
              <div className="relative">
                <button
                  aria-label="Open notifications"
                  onClick={() => setNotifyOpen((value) => !value)}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white text-bark shadow-sm"
                >
                  <Bell size={19} className={unreadCount ? "animate-pulse text-coral" : ""} />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[11px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-80 rounded-3xl border border-bark/10 bg-white p-3 shadow-soft"
                    >
                      {notifications.slice(0, 5).map((item) => (
                        <button
                          key={item._id || item.id}
                          className="w-full rounded-2xl p-3 text-left hover:bg-cream"
                          onClick={() => markRead(item._id || item.id)}
                        >
                          <p className="text-sm font-bold text-ink">{item.title || item.message}</p>
                          {item.title && <p className="mt-1 text-xs text-bark/60">{item.message}</p>}
                        </button>
                      ))}
                      {!notifications.length && <p className="p-4 text-sm text-bark/60">No notifications yet.</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            {isAuthenticated ? (
              <>
                <Button as={Link} to={dashboardPath(user?.role)} variant="secondary">
                  <LayoutDashboard size={18} /> Dashboard
                </Button>
                <button onClick={logout} className="flex h-11 w-11 items-center justify-center rounded-full bg-bark text-white" aria-label="Logout">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="secondary">
                  <User size={18} /> Login
                </Button>
                <Button as={Link} to="/register">
                  <HeartHandshake size={18} /> Register
                </Button>
              </>
            )}
          </div>

          <button onClick={() => setOpen(true)} className="rounded-full bg-white p-3 text-bark shadow-sm lg:hidden" aria-label="Open menu">
            <Menu />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="ml-auto flex h-full w-80 max-w-[86vw] flex-col bg-cream p-5 shadow-soft"
            >
              <div className="mb-8 flex items-center justify-between">
                <Link to="/" className="text-2xl font-black tracking-tighter text-coral">
                  AniRescue
                </Link>
                <button onClick={() => setOpen(false)} className="rounded-full bg-white p-2" aria-label="Close menu">
                  <X />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <NavLinks onClick={() => setOpen(false)} />
                {isAuthenticated ? (
                  <>
                    <NavLink to={dashboardPath(user?.role)} onClick={() => setOpen(false)} className="rounded-full px-4 py-3 font-semibold text-bark">
                      Dashboard
                    </NavLink>
                    <button onClick={logout} className="rounded-full bg-bark px-4 py-3 text-left font-semibold text-white">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" onClick={() => setOpen(false)} className="rounded-full px-4 py-3 font-semibold text-bark">
                      Login
                    </NavLink>
                    <NavLink to="/register" onClick={() => setOpen(false)} className="rounded-full bg-moss px-4 py-3 font-semibold text-white">
                      Register
                    </NavLink>
                  </>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <Outlet />

      <footer className="border-t border-bark/10 bg-white/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-3 font-extrabold">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral text-white">
                <PawPrint size={20} />
              </span>
              AniRescue
            </div>
            <p className="max-w-md text-sm leading-6 text-bark/70">
              Funding emergency rescues, surgeries, medicines, and recovery care for injured animals through transparent community giving.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-ink">Quick links</h4>
            <div className="flex flex-col gap-2 text-sm text-bark/70">
              <Link to="/campaigns">Campaigns</Link>
              <Link to="/apply-campaigner">Apply as campaigner</Link>
              <Link to="/dashboard/donor">Donor dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-bold text-ink">Contact</h4>
            <p className="text-sm text-bark/70">hello@aniRescue.org</p>
            <div className="mt-4 flex rounded-full border border-bark/10 bg-cream p-1">
              <input className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" placeholder="Email updates" aria-label="Newsletter email" />
              <button className="rounded-full bg-coral px-4 py-2 text-sm font-bold text-white">Join</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

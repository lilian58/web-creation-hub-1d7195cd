import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, BookOpen, Mic, MessageCircle, User, NotebookPen, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/spiritlink-logo.png";

const navItems = [
  { to: "/app", label: "Accueil", icon: Home, end: true },
  { to: "/app/bible", label: "Bible", icon: BookOpen },
  { to: "/app/predications", label: "Prédications", icon: Mic },
  { to: "/app/journal", label: "Journal", icon: NotebookPen },
  { to: "/app/messages", label: "Messages", icon: MessageCircle },
  { to: "/app/profil", label: "Profil", icon: User },
];

export default function AppLayout() {
  const location = useLocation();
  const titleMap: Record<string, string> = {
    "/app": "Accueil",
    "/app/bible": "Bible",
    "/app/predications": "Prédications",
    "/app/journal": "Journal",
    "/app/messages": "Messages",
    "/app/profil": "Profil",
  };
  const pageTitle = titleMap[location.pathname] ?? "SpiritLink";

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground sticky top-0 h-screen p-6 gap-2">
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="SpiritLink" className="w-10 h-10" width={40} height={40} />
          <div>
            <h1 className="font-display text-2xl text-gold leading-none">SpiritLink</h1>
            <p className="text-xs text-sidebar-foreground/70 mt-1">Connectés en esprit</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-gold text-sidebar-primary-foreground font-semibold shadow-glow"
                    : "hover:bg-sidebar-accent text-sidebar-foreground/90"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto text-xs text-sidebar-foreground/60">
          © 2026 SpiritLink
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="w-8 h-8" width={32} height={32} />
            <span className="font-display text-lg font-semibold text-primary">{pageTitle}</span>
          </div>
          <button className="relative p-2 rounded-full hover:bg-muted transition" aria-label="Notifications">
            <Bell className="w-5 h-5 text-primary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
          </button>
        </header>

        <main className="flex-1 pb-24 lg:pb-6">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t shadow-card">
          <div className="grid grid-cols-5 max-w-lg mx-auto">
            {navItems.filter(i => i.to !== "/app/journal").map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 py-3 text-xs transition-colors",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn("w-5 h-5", isActive && "fill-primary/10")} strokeWidth={isActive ? 2.5 : 2} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

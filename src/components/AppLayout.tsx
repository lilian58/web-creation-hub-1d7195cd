import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Home, BookOpen, Mic, MessageCircle, User, NotebookPen, Bell, Library, Users, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/spiritlink-logo.png";
import { useRole } from "@/hooks/use-role";

const baseNav = [
  { to: "/app", label: "Accueil", icon: Home, end: true },
  { to: "/app/bible", label: "Bible", icon: BookOpen },
  { to: "/app/bibliotheque", label: "Livres", icon: Library },
  { to: "/app/predications", label: "Prédications", icon: Mic },
  { to: "/app/journal", label: "Journal", icon: NotebookPen },
  { to: "/app/messages", label: "Messages", icon: MessageCircle },
  { to: "/app/contacts", label: "Contacts", icon: Users },
  { to: "/app/profil", label: "Profil", icon: User },
];

export default function AppLayout() {
  const location = useLocation();
  const [role] = useRole();

  const navItems = [
    ...baseNav.slice(0, -1),
    ...(role === "creator" ? [{ to: "/app/creator", label: "Créateur", icon: Sparkles, end: false }] : []),
    ...(role === "admin" ? [{ to: "/app/admin", label: "Admin", icon: ShieldAlert, end: false }] : []),
    baseNav[baseNav.length - 1],
  ];

  const mobileNavItems = navItems.filter(
    (i) => !["/app/journal", "/app/bibliotheque", "/app/messages"].includes(i.to)
  ).slice(0, 5);

  const titleMap: Record<string, string> = {
    "/app": "Accueil",
    "/app/bible": "Bible",
    "/app/bibliotheque": "Bibliothèque",
    "/app/predications": "Prédications",
    "/app/journal": "Journal",
    "/app/journal/new": "Nouvelle note",
    "/app/messages": "Messages",
    "/app/messages/new": "Nouvelle conversation",
    "/app/contacts": "Contacts",
    "/app/downloads": "Téléchargements",
    "/app/admin": "Admin",
    "/app/creator": "Créateur",
    "/app/profil": "Profil",
  };
  const pageTitle = titleMap[location.pathname] ?? "SpiritLink";

  // Les écrans d'appel sont déjà fixed inset-0 et se superposent au layout, ok.

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* Sidebar : visible dès md (tablette) */}
      <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-sidebar text-sidebar-foreground sticky top-0 h-screen p-3 lg:p-6 gap-2 shrink-0">
        <div className="flex items-center gap-3 mb-8 px-1 lg:px-0 justify-center lg:justify-start">
          <img src={logo} alt="SpiritLink" className="w-10 h-10 shrink-0" width={40} height={40} />
          <div className="hidden lg:block">
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
              title={item.label}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all justify-center lg:justify-start",
                  isActive
                    ? "bg-gold text-sidebar-primary-foreground font-semibold shadow-glow"
                    : "hover:bg-sidebar-accent text-sidebar-foreground/90"
                )
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="hidden lg:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto text-xs text-sidebar-foreground/60 hidden lg:block">
          © 2026 SpiritLink
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile-only header */}
        <header className="md:hidden sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="w-8 h-8" width={32} height={32} />
            <span className="font-display text-lg font-semibold text-primary">{pageTitle}</span>
          </div>
          <button className="relative p-2 rounded-full hover:bg-muted transition" aria-label="Notifications">
            <Bell className="w-5 h-5 text-primary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold rounded-full" />
          </button>
        </header>

        {/* Desktop/tablet header */}
        <header className="hidden md:flex sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-6 lg:px-10 py-4 items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-primary">{pageTitle}</h2>
          <button className="relative p-2.5 rounded-full hover:bg-muted transition" aria-label="Notifications">
            <Bell className="w-5 h-5 text-primary" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full" />
          </button>
        </header>

        <main className="flex-1 pb-24 md:pb-6 min-w-0">
          <Outlet />
        </main>

        {/* Mobile-only floating Messages button */}
        {!/^\/app\/(call|messages)/.test(location.pathname) && (
          <NavLink
            to="/app/messages"
            aria-label="Messages"
            className="md:hidden fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full gradient-primary text-primary-foreground flex items-center justify-center shadow-glow active:scale-95 transition"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-primary-deep text-[10px] font-bold flex items-center justify-center border-2 border-card">
              3
            </span>
          </NavLink>
        )}

        {/* Mobile-only bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t shadow-card">
          <div className="grid grid-cols-5 max-w-lg mx-auto">
            {mobileNavItems.map((item) => (
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
                    <item.icon
                      className={cn("w-5 h-5", isActive && "fill-primary/10")}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
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

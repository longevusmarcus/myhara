import { Home, Map, Plus, TrendingUp, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Today", path: "/home" },
    { icon: TrendingUp, label: "Insights", path: "/insights" },
    { icon: Plus, label: "Check In", path: "/check-in" },
    { icon: Map, label: "Journey", path: "/map" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 px-4 safe-area-bottom">
      <div className="max-w-lg mx-auto">
        <div className="backdrop-blur-xl bg-background/80 border border-border/50 rounded-full shadow-2xl px-2 py-2">
          <div className="flex justify-between items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-full transition-all duration-300 min-w-[60px] ${
                    isActive 
                      ? "bg-foreground text-background" 
                      : "text-muted-foreground hover:text-foreground hover:scale-105"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[8px] font-medium whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;

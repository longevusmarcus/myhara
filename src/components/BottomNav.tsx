import { Home, Map, Plus, TrendingUp, User, DollarSign, Briefcase, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  const navItems = [
    { icon: Home, label: "Today", path: "/home" },
    { icon: TrendingUp, label: "Insights", path: "/insights" },
    { icon: Plus, label: "", path: "/check-in", isCenter: true },
    { icon: Map, label: "Journey", path: "/map" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const handleCheckInChoice = (category: string) => {
    setShowCheckInModal(false);
    navigate(`/check-in?mode=tap&category=${category}`);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-bottom">
        <div className="flex justify-around items-center h-20 px-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            if (item.isCenter) {
              return (
                <button
                  key={item.path}
                  onClick={() => setShowCheckInModal(true)}
                  className="flex flex-col items-center justify-center -mt-6"
                >
                  <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-background" />
                  </div>
                </button>
              );
            }
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <Dialog open={showCheckInModal} onOpenChange={setShowCheckInModal}>
        <DialogContent className="sm:max-w-[320px] bg-background/95 backdrop-blur-xl border-border/50 p-8">
          <div className="space-y-4">
            <button
              onClick={() => handleCheckInChoice('finance')}
              className="w-full flex items-center justify-between gap-4 group"
            >
              <div className="bg-card px-6 py-3 rounded-full shadow-md border border-border group-hover:shadow-lg transition-all">
                <span className="text-sm font-medium text-foreground">Finance</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
            </button>

            <button
              onClick={() => handleCheckInChoice('career')}
              className="w-full flex items-center justify-between gap-4 group"
            >
              <div className="bg-card px-6 py-3 rounded-full shadow-md border border-border group-hover:shadow-lg transition-all">
                <span className="text-sm font-medium text-foreground">Career</span>
              </div>
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
            </button>

            <button
              onClick={() => setShowCheckInModal(false)}
              className="w-14 h-14 rounded-full bg-card mx-auto flex items-center justify-center shadow-md border border-border hover:bg-accent transition-colors mt-6"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BottomNav;

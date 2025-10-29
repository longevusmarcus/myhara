import { Home, Map, Plus, TrendingUp, User, Mic, Edit3 } from "lucide-react";
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

  const handleCheckInChoice = (mode: 'tap' | 'voice') => {
    setShowCheckInModal(false);
    navigate(`/check-in?mode=${mode}`);
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
        <DialogContent className="sm:max-w-[420px] bg-card/95 backdrop-blur-xl border-border/50">
          <DialogHeader className="space-y-3 pb-2">
            <DialogTitle className="text-center text-2xl font-light tracking-tight">
              How do you want to check in?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-6">
            <button
              onClick={() => handleCheckInChoice('tap')}
              className="group w-full p-8 bg-background/50 border border-border/50 rounded-3xl hover:bg-accent/50 hover:border-border transition-all duration-300 flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Edit3 className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-medium text-foreground mb-1">Type Log</h3>
                <p className="text-sm text-muted-foreground/80 font-light">
                  Quick and discreet logging
                </p>
              </div>
            </button>

            <button
              onClick={() => handleCheckInChoice('voice')}
              className="group w-full p-8 bg-background/50 border border-border/50 rounded-3xl hover:bg-accent/50 hover:border-border transition-all duration-300 flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-medium text-foreground mb-1">Voice Chat</h3>
                <p className="text-sm text-muted-foreground/80 font-light">
                  Express yourself freely
                </p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BottomNav;

import { Home, Map, Plus, TrendingUp, User, Mic, Edit3, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
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
        <DialogContent className="sm:max-w-[320px] bg-gradient-to-b from-primary/10 to-primary/5 backdrop-blur-xl border-none p-8 shadow-xl">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => handleCheckInChoice('tap')}
              className="flex items-center justify-between group"
            >
              <div className="bg-background text-foreground px-6 py-3 rounded-full shadow-md font-medium group-hover:shadow-lg transition-shadow">
                Type
              </div>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Edit3 className="w-6 h-6 text-primary-foreground" />
              </div>
            </button>

            <button
              onClick={() => handleCheckInChoice('voice')}
              className="flex items-center justify-between group"
            >
              <div className="bg-background text-foreground px-6 py-3 rounded-full shadow-md font-medium group-hover:shadow-lg transition-shadow">
                Voice
              </div>
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Mic className="w-6 h-6 text-primary-foreground" />
              </div>
            </button>

            <button
              onClick={() => setShowCheckInModal(false)}
              className="mx-auto mt-2 w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-md hover:shadow-lg hover:scale-105 transition-all"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BottomNav;

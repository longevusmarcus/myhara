import { Home, Map, Plus, TrendingUp, User, Mic, Edit3 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

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

  const toggleCheckInModal = () => {
    setShowCheckInModal(!showCheckInModal);
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
                <div key={item.path} className="relative flex items-center justify-center -mt-6">
                  {showCheckInModal && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      <button
                        onClick={() => handleCheckInChoice('tap')}
                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      >
                        <Edit3 className="w-4 h-4 text-primary-foreground" />
                      </button>
                      <button
                        onClick={() => handleCheckInChoice('voice')}
                        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                      >
                        <Mic className="w-4 h-4 text-primary-foreground" />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={toggleCheckInModal}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center shadow-lg">
                      <Icon className="w-6 h-6 text-background" />
                    </div>
                  </button>
                </div>
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
    </>
  );
};

export default BottomNav;

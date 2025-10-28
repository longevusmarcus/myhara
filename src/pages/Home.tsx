import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

const Home = () => {
  const navigate = useNavigate();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "good morning.";
    if (hour < 18) return "good afternoon.";
    return "good evening.";
  };

  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const today = new Date();
  const currentDay = today.getDay();
  const currentDate = today.getDate();

  const getDayInfo = (offset: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() + offset - 3);
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      isCurrent: offset === 3,
    };
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-light text-foreground">{getGreeting()}</h1>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-sm font-medium">U</span>
        </div>
      </div>

      {/* Calendar Week View */}
      <div className="px-6 mb-8">
        <div className="flex justify-between">
          {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
            const dayInfo = getDayInfo(offset);
            return (
              <div
                key={offset}
                className={`flex flex-col items-center gap-1 ${
                  dayInfo.isCurrent ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <span className="text-xs font-light">{dayInfo.day}</span>
                <span className={`text-sm font-medium ${
                  dayInfo.isCurrent ? "w-8 h-8 flex items-center justify-center rounded-full bg-foreground text-background" : ""
                }`}>
                  {dayInfo.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Gut Button - Central Entry Point */}
      <div className="px-6 flex-1 flex flex-col items-center justify-center space-y-8 py-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-medium text-foreground">
            What's your gut saying right now?
          </h2>
        </div>

        {/* Glowing Gut Button */}
        <div className="relative">
          <div className="absolute inset-0 bg-foreground/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-foreground/90 to-foreground flex items-center justify-center shadow-2xl">
            <div className="w-32 h-32 rounded-full bg-background/10 flex items-center justify-center">
              <span className="text-5xl">✨</span>
            </div>
          </div>
        </div>

        {/* Entry Options */}
        <div className="w-full max-w-sm space-y-3">
          <button
            onClick={() => navigate("/check-in?mode=tap")}
            className="w-full px-8 py-4 bg-card border border-border rounded-[1.25rem] text-foreground hover:bg-card/80 transition-all flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🟣</span>
            <span className="text-base font-medium">Tap to Log</span>
          </button>

          <button
            onClick={() => navigate("/check-in?mode=voice")}
            className="w-full px-8 py-4 bg-card border border-border rounded-[1.25rem] text-foreground hover:bg-card/80 transition-all flex items-center justify-center gap-3"
          >
            <span className="text-2xl">🎙️</span>
            <span className="text-base font-medium">Hold to Speak</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;

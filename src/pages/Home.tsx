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
      <div className="px-6 mb-6">
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

      {/* Main Check-in Card */}
      <div className="px-6 space-y-4">
        <Card
          onClick={() => navigate("/check-in")}
          className="bg-card border-border p-8 cursor-pointer hover:bg-card/80 transition-colors rounded-3xl"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-light tracking-wide uppercase">
                Morning Preparation
              </p>
              <h2 className="text-2xl font-medium text-foreground">
                New day, fresh start!
              </h2>
            </div>
            <button className="px-8 py-3 bg-foreground text-background rounded-full text-sm font-medium hover:bg-foreground/90 transition-colors">
              Begin
            </button>
          </div>
        </Card>

        {/* Reflection Prompt */}
        <Card className="bg-card border-border p-6 rounded-3xl">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-light">
              on glowing reviews.
            </p>
            <p className="text-base text-foreground/80 leading-relaxed font-light">
              Are you the type of person who leaves reviews often?
            </p>
            <button className="px-6 py-2.5 bg-secondary text-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors inline-flex items-center gap-2">
              Reflect
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>

        {/* Get Inspired Section */}
        <div className="pt-4">
          <p className="text-xs text-muted-foreground font-light tracking-wide uppercase mb-4">
            Get Inspired
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {["Morning", "Evening", "Quick", "Deep"].map((type) => (
              <button
                key={type}
                className="px-5 py-2.5 bg-secondary text-foreground rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors whitespace-nowrap"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;

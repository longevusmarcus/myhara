import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, Target } from "lucide-react";
import { AICoach } from "@/components/AICoach";
import { useState, useEffect } from "react";

const Insights = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [showDailyGuidance, setShowDailyGuidance] = useState(false);
  const [hasSeenToday, setHasSeenToday] = useState(false);

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem("gutEntries") || "[]");
    setEntries(storedEntries);
    
    const lastSeen = localStorage.getItem("lastDailyGuidance");
    const today = new Date().toDateString();
    setHasSeenToday(lastSeen === today);
  }, []);

  const handleStartGuidance = () => {
    setShowDailyGuidance(true);
    localStorage.setItem("lastDailyGuidance", new Date().toDateString());
    setHasSeenToday(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-cursive text-foreground tracking-tight">Insights</h1>
          <p className="text-base text-muted-foreground font-light">
            Your intuition patterns over time
          </p>
        </div>

        {/* Daily Guidance */}
        <Card className={`${hasSeenToday && !showDailyGuidance ? 'bg-card/50' : 'bg-card'} border-border p-6 rounded-3xl`}>
          {!showDailyGuidance ? (
            <div className="space-y-4">
              <p className="text-base font-light text-foreground">
                {hasSeenToday 
                  ? "Come back tomorrow for new guidance"
                  : "Ready for your daily check-in?"
                }
              </p>
              {!hasSeenToday && (
                <button
                  onClick={handleStartGuidance}
                  className="px-6 py-2 bg-foreground text-background rounded-full text-sm font-light hover:opacity-90 transition-opacity"
                >
                  Start
                </button>
              )}
            </div>
          ) : (
            <AICoach initialPrompt="I'm ready for today's check-in. What should I reflect on?" />
          )}
        </Card>

        {/* Trust Score */}
        <Card className="bg-card border-border p-6 rounded-3xl">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-light">Trust Score</p>
                <p className="text-2xl font-medium text-foreground">67%</p>
              </div>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-foreground rounded-full" style={{ width: "67%" }} />
            </div>
            <p className="text-sm text-muted-foreground font-light">
              You're honoring your gut feelings more often. Keep building that trust.
            </p>
          </div>
        </Card>

        {/* Patterns */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-foreground">Patterns</h2>
          
          <Card className="bg-card border-border p-6 rounded-3xl">
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-muted-foreground mt-1" />
              <div className="space-y-1">
                <p className="text-base text-foreground font-light">
                  Your gut is strongest in the <span className="font-medium">morning</span>
                </p>
                <p className="text-sm text-muted-foreground font-light">
                  Based on 12 check-ins between 6AM-9AM
                </p>
              </div>
            </div>
          </Card>

          <Card className="bg-card border-border p-6 rounded-3xl">
            <div className="flex items-start gap-4">
              <Target className="w-5 h-5 text-muted-foreground mt-1" />
              <div className="space-y-1">
                <p className="text-base text-foreground font-light">
                  When you feel tension, <span className="font-medium">80% lead to misalignment</span>
                </p>
                <p className="text-sm text-muted-foreground font-light">
                  Trust that tightness — it's usually right
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Summary */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-foreground">This Week</h2>
          
          <Card className="bg-card border-border p-6 rounded-3xl">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-medium text-foreground">12</p>
                <p className="text-xs text-muted-foreground font-light mt-1">Check-ins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium text-foreground">7</p>
                <p className="text-xs text-muted-foreground font-light mt-1">Day streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium text-foreground">8</p>
                <p className="text-xs text-muted-foreground font-light mt-1">Honored</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Insights;

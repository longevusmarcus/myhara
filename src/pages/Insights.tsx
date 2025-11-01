import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, Target, Zap, Heart } from "lucide-react";
import { AICoach } from "@/components/AICoach";
import { useState, useEffect } from "react";
import { getGamificationData } from "@/utils/gamification";

const Insights = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [showDailyGuidance, setShowDailyGuidance] = useState(false);
  const [hasSeenToday, setHasSeenToday] = useState(false);
  const [trustScore, setTrustScore] = useState(0);
  const [weekStats, setWeekStats] = useState({ checkins: 0, honored: 0, decisions: 0 });
  const [timePattern, setTimePattern] = useState<{ time: string; count: number } | null>(null);
  const [sensationPattern, setSensationPattern] = useState<{ sensation: string; accuracy: number } | null>(null);

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem("gutEntries") || "[]");
    setEntries(storedEntries);
    
    const lastSeen = localStorage.getItem("lastDailyGuidance");
    const today = new Date().toDateString();
    setHasSeenToday(lastSeen === today);

    // Calculate trust score
    const totalWithDecisions = storedEntries.filter((e: any) => e.willIgnore !== undefined).length;
    const honored = storedEntries.filter((e: any) => e.willIgnore === "no").length;
    const score = totalWithDecisions > 0 ? Math.round((honored / totalWithDecisions) * 100) : 0;
    setTrustScore(score);

    // Calculate this week's stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekEntries = storedEntries.filter((e: any) => new Date(e.timestamp) >= oneWeekAgo);
    setWeekStats({
      checkins: thisWeekEntries.length,
      honored: thisWeekEntries.filter((e: any) => e.willIgnore === "no").length,
      decisions: thisWeekEntries.filter((e: any) => e.decision && e.decision.trim().length > 0).length
    });

    // Find time of day pattern
    const timeOfDayMap: { [key: string]: number } = {};
    storedEntries.forEach((e: any) => {
      const hour = new Date(e.timestamp).getHours();
      let timeOfDay = "morning";
      if (hour >= 6 && hour < 12) timeOfDay = "morning";
      else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
      else if (hour >= 17 && hour < 21) timeOfDay = "evening";
      else timeOfDay = "night";
      
      timeOfDayMap[timeOfDay] = (timeOfDayMap[timeOfDay] || 0) + 1;
    });
    
    const topTime = Object.entries(timeOfDayMap).sort((a, b) => b[1] - a[1])[0];
    if (topTime) {
      setTimePattern({ time: topTime[0], count: topTime[1] });
    }

    // Find body sensation accuracy pattern
    const sensationMap: { [key: string]: { total: number; positive: number } } = {};
    storedEntries.forEach((e: any) => {
      if (e.bodySensation && e.consequence) {
        const sensation = e.bodySensation;
        if (!sensationMap[sensation]) {
          sensationMap[sensation] = { total: 0, positive: 0 };
        }
        sensationMap[sensation].total++;
        
        // Check if outcome was positive (simplified check)
        const outcomeText = e.consequence.toLowerCase();
        const isPositive = outcomeText.includes("worked") || 
                          outcomeText.includes("right") || 
                          outcomeText.includes("good") ||
                          outcomeText.includes("better") ||
                          e.willIgnore === "no";
        if (isPositive) {
          sensationMap[sensation].positive++;
        }
      }
    });

    const topSensation = Object.entries(sensationMap)
      .filter(([_, data]) => data.total >= 2)
      .map(([sensation, data]) => ({
        sensation,
        accuracy: Math.round((data.positive / data.total) * 100)
      }))
      .sort((a, b) => b.accuracy - a.accuracy)[0];
    
    if (topSensation) {
      setSensationPattern(topSensation);
    }
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
          {entries.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-base text-muted-foreground font-light">
                Start checking in to build your trust score
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-light">Trust Score</p>
                  <p className="text-2xl font-medium text-foreground">{trustScore}%</p>
                </div>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" 
                  style={{ width: `${trustScore}%` }} 
                />
              </div>
              <p className="text-sm text-muted-foreground font-light">
                {trustScore >= 70 
                  ? "You're honoring your gut feelings consistently. Keep it up!" 
                  : trustScore >= 40 
                  ? "You're building trust with your intuition. Stay curious."
                  : trustScore > 0
                  ? "Every time you honor your gut, you build more trust."
                  : "Start tracking decisions to see your trust score grow."}
              </p>
            </div>
          )}
        </Card>

        {/* Patterns */}
        {entries.length >= 3 && (
          <div className="space-y-3">
            <h2 className="text-lg font-medium text-foreground">Patterns</h2>
            
            {timePattern && (
              <Card className="bg-card border-border p-6 rounded-3xl">
                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-accent mt-1" strokeWidth={1.5} />
                  <div className="space-y-1">
                    <p className="text-base text-foreground font-light">
                      You check in most often in the <span className="font-medium">{timePattern.time}</span>
                    </p>
                    <p className="text-sm text-muted-foreground font-light">
                      Based on {timePattern.count} {timePattern.count === 1 ? 'check-in' : 'check-ins'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {sensationPattern && (
              <Card className="bg-card border-border p-6 rounded-3xl">
                <div className="flex items-start gap-4">
                  <Zap className="w-5 h-5 text-primary mt-1" strokeWidth={1.5} />
                  <div className="space-y-1">
                    <p className="text-base text-foreground font-light">
                      When you feel <span className="font-medium lowercase">{sensationPattern.sensation}</span>, it's <span className="font-medium">{sensationPattern.accuracy}% accurate</span>
                    </p>
                    <p className="text-sm text-muted-foreground font-light">
                      {sensationPattern.accuracy >= 70 
                        ? "This signal is highly reliable for you"
                        : "Keep tracking to understand this signal better"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {!timePattern && !sensationPattern && entries.length < 5 && (
              <Card className="bg-card border-border p-6 rounded-3xl">
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground font-light">
                    Keep checking in to discover your patterns
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Weekly Summary */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-foreground">This Week</h2>
          
          <Card className="bg-card border-border p-6 rounded-3xl">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-medium text-foreground">{weekStats.checkins}</p>
                <p className="text-xs text-muted-foreground font-light mt-1">Check-ins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium text-foreground">{getGamificationData().currentStreak}</p>
                <p className="text-xs text-muted-foreground font-light mt-1">Day streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium text-foreground">{weekStats.honored}</p>
                <p className="text-xs text-muted-foreground font-light mt-1">Honored</p>
              </div>
            </div>
            {weekStats.decisions > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-center text-muted-foreground font-light">
                  {weekStats.decisions} decision{weekStats.decisions !== 1 ? 's' : ''} tracked this week
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Insights;

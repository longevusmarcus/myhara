import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame, Pause, Sparkles, Shield, Loader2 } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getGamificationData, calculateLevel, getLevelName } from "@/utils/gamification";
import { supabase } from "@/integrations/supabase/client";

const Home = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [missions, setMissions] = useState<any[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  const [gamData, setGamData] = useState(getGamificationData());
  const [userName, setUserName] = useState("there");
  const [loadingMissions, setLoadingMissions] = useState(false);

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem("gutEntries") || "[]");
    setEntries(storedEntries);
    setGamData(getGamificationData());
    
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data }: any = await (supabase.from("profiles") as any)
          .select("nickname")
          .eq("id", user.id)
          .maybeSingle();
        
        if (data?.nickname) {
          setUserName(String(data.nickname));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
    
    // Generate insights
    const generatedInsights = generateInsights(storedEntries);
    setInsights(generatedInsights);

    // Load or generate missions
    loadMissions(storedEntries);
  }, []);

  const levelInfo = calculateLevel(gamData.totalXP);
  const levelName = getLevelName(levelInfo.level);

  const loadMissions = async (allEntries: any[]) => {
    // Check for cached missions from today
    const cachedMissions = localStorage.getItem("cachedMissions");
    const cachedMissionsDate = localStorage.getItem("cachedMissionsDate");
    const today = new Date().toDateString();

    if (cachedMissions && cachedMissionsDate === today) {
      // Use cached missions if they're from today
      setMissions(JSON.parse(cachedMissions));
      return;
    }

    // If less than 3 entries, use default missions
    if (allEntries.length < 3) {
      const defaultMissions = [
        { id: 1, title: "Pause before saying yes to something", category: "gut trust", Icon: Pause },
        { id: 2, title: "Notice one body signal today", category: "awareness", Icon: Sparkles },
        { id: 3, title: "Honor a no that feels right", category: "boundaries", Icon: Shield },
      ];
      setMissions(defaultMissions);
      return;
    }

    // Generate AI-powered missions
    setLoadingMissions(true);
    try {
      const currentUserName = userName || "the user";
      
      const entriesSummary = allEntries.slice(-10).map((e: any) => ({
        timestamp: e.timestamp,
        mode: e.mode,
        label: e.label || e.gutFeeling,
        bodySensation: e.bodySensation,
        honored: e.willIgnore === "no",
        decision: e.decision,
        consequence: e.consequence
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gut-coach`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Generate 3 personalized missions for ${currentUserName} based on their check-in data:\n\n${JSON.stringify(entriesSummary, null, 2)}`
              }
            ],
            type: "mission_generation",
            userName: currentUserName
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate missions");

      const data = await response.json();
      
      if (data.missions && Array.isArray(data.missions)) {
        const iconMap = [Pause, Sparkles, Shield];
        const missionsWithIcons = data.missions.map((m: any, idx: number) => ({
          id: idx + 1,
          title: m.title,
          category: m.category,
          Icon: iconMap[idx % iconMap.length]
        }));
        
        setMissions(missionsWithIcons);
        
        // Cache missions for today
        localStorage.setItem("cachedMissions", JSON.stringify(missionsWithIcons));
        localStorage.setItem("cachedMissionsDate", today);
      }
    } catch (error) {
      console.error("Mission generation error:", error);
      // Fall back to default missions
      const defaultMissions = [
        { id: 1, title: "Pause before saying yes to something", category: "gut trust", Icon: Pause },
        { id: 2, title: "Notice one body signal today", category: "awareness", Icon: Sparkles },
        { id: 3, title: "Honor a no that feels right", category: "boundaries", Icon: Shield },
      ];
      setMissions(defaultMissions);
    } finally {
      setLoadingMissions(false);
    }
  };

  const generateInsights = (entries: any[]) => {
    if (entries.length === 0) {
      return ["Start checking in to see personalized insights"];
    }

    const insights = [];
    const recentEntries = entries.slice(-7);
    
    // Insight about check-in frequency
    if (recentEntries.length >= 5) {
      insights.push(`You've checked in ${recentEntries.length} times this week`);
    }

    // Insight about honoring gut
    const honored = recentEntries.filter(e => e.willIgnore === "no").length;
    if (honored > recentEntries.length / 2) {
      insights.push("You're honoring your gut more often lately");
    } else if (honored < recentEntries.length / 3) {
      insights.push("Try honoring your gut feelings more this week");
    }

    // Insight about body sensations
    const sensations = recentEntries.map(e => e.bodySensation).filter(Boolean);
    if (sensations.length > 0) {
      const mostCommon = sensations.sort((a, b) =>
        sensations.filter(v => v === a).length - sensations.filter(v => v === b).length
      ).pop();
      if (mostCommon) {
        insights.push(`"${mostCommon}" is your most common signal`);
      }
    }

    return insights.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-4xl font-cursive text-foreground tracking-tight">Hey, {userName}</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium">{gamData.currentStreak}</span>
        </div>
      </div>

      {/* Today's Focus Card */}
      <div className="px-6 mb-8">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-light">
          today's focus
        </h2>
        <Card className="bg-card border-border p-5 rounded-[1.25rem] flex items-start justify-between gap-4">
          <p className="text-base font-light text-foreground leading-relaxed">
            return to your center — where gut-driven decisions are born
          </p>
          <button className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors">
            <ArrowRight className="w-4 h-4 text-foreground" />
          </button>
        </Card>
      </div>

      {/* Central Voice AI Orb */}
      <div className="px-6 flex flex-col items-center justify-center mb-8">
        {/* Glowing Orb */}
        <div className="relative mb-6">
          {/* Outer glow rings - pulsing */}
          <div className="absolute inset-0 w-64 h-64 -left-4 -top-4 bg-gradient-to-br from-primary/40 via-accent/40 to-secondary/40 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-0 w-60 h-60 -left-2 -top-2 bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
          
          {/* Main orb */}
          <button
            onClick={() => navigate("/check-in?mode=voice")}
            className="relative w-56 h-56 rounded-full bg-gradient-to-br from-primary/90 via-accent/90 to-secondary/90 flex items-center justify-center shadow-2xl shadow-primary/20 transition-transform hover:scale-105 animate-pulse"
            style={{ animationDuration: '3s' }}
          >
            {/* Inner reflection/highlight */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-16 bg-white/30 rounded-full blur-2xl" />
            
            {/* Subtle particles */}
            <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/60 rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-white/50 rounded-full animate-pulse delay-75" />
            <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-pulse delay-150" />
          </button>
        </div>

        {/* Tap to speak text */}
        <p className="text-sm text-muted-foreground font-light mb-4">tap to speak</p>

        {/* Level & Days */}
        <div className="text-center space-y-1">
          <p className="text-sm text-foreground font-light">
            level {levelInfo.level} <span className="text-muted-foreground">•</span> {levelName.toLowerCase()}
          </p>
          <p className="text-xs text-muted-foreground font-light">{gamData.currentStreak} days together</p>
        </div>
      </div>

      {/* Today's Missions */}
      <div className="px-6 mb-8">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-light">
          today's missions
        </h2>
        {loadingMissions ? (
          <Card className="bg-card border-border p-8 rounded-[1.25rem] flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating personalized missions...</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {missions.map((mission) => (
              <Card
                key={mission.id}
                className="bg-card border-border p-4 rounded-[1.25rem] flex items-center gap-4 hover:bg-card/80 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                  <mission.Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-base font-light text-foreground">{mission.title}</p>
                  <p className="text-xs font-light text-muted-foreground">{mission.category}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Recent Insights */}
      <div className="px-6">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-light">
          recent insights
        </h2>
        <div className="space-y-2">
          {insights.map((insight, idx) => (
            <Card key={idx} className="bg-card border-border p-4 rounded-[1.25rem]">
              <p className="text-sm text-foreground font-light">{insight}</p>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;

import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame, Pause, Sparkles, Shield } from "lucide-react";
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
          .eq("user_id", user.id)
          .maybeSingle();
        
        if (data?.nickname) {
          setUserName(String(data.nickname));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
    
    // Generate personalized missions based on user data
    const generatedMissions = generateMissions(storedEntries);
    setMissions(generatedMissions);
    
    // Generate insights
    const generatedInsights = generateInsights(storedEntries);
    setInsights(generatedInsights);
  }, []);

  const levelInfo = calculateLevel(gamData.totalXP);
  const levelName = getLevelName(levelInfo.level);

  const generateMissions = (entries: any[]) => {
    const defaultMissions = [
      { id: 1, title: "Pause before saying yes to something", category: "gut trust", color: "text-cyan-500", Icon: Pause },
      { id: 2, title: "Notice one body signal today", category: "awareness", color: "text-purple-500", Icon: Sparkles },
      { id: 3, title: "Honor a no that feels right", category: "boundaries", color: "text-green-500", Icon: Shield },
    ];

    if (entries.length === 0) return defaultMissions;

    const personalizedMissions = [];
    const ignoredCount = entries.filter(e => e.willIgnore === "yes").length;
    const totalCount = entries.length;
    const ignoredRate = ignoredCount / totalCount;

    // Mission based on ignore rate
    if (ignoredRate > 0.5) {
      personalizedMissions.push({
        id: 1,
        title: "Practice honoring one gut feeling today",
        category: "trust building",
        color: "text-cyan-500",
        Icon: Pause
      });
    } else {
      personalizedMissions.push({
        id: 1,
        title: "Notice when your gut feels strongest",
        category: "awareness",
        color: "text-cyan-500",
        Icon: Sparkles
      });
    }

    // Mission based on most common body sensation
    const sensations = entries.map(e => e.bodySensation).filter(Boolean);
    if (sensations.length > 0) {
      personalizedMissions.push({
        id: 2,
        title: "Check in when you feel tension today",
        category: "body awareness",
        color: "text-purple-500",
        Icon: Sparkles
      });
    } else {
      personalizedMissions.push(defaultMissions[1]);
    }

    // Mission based on decision tracking
    const decisionsTracked = entries.filter(e => e.decision).length;
    if (decisionsTracked < 3) {
      personalizedMissions.push({
        id: 3,
        title: "Track one decision you make today",
        category: "follow-through",
        color: "text-green-500",
        Icon: Shield
      });
    } else {
      personalizedMissions.push({
        id: 3,
        title: "Review a past decision outcome",
        category: "reflection",
        color: "text-green-500",
        Icon: Shield
      });
    }

    return personalizedMissions.slice(0, 3);
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
        <div className="space-y-3">
          {missions.map((mission) => (
            <Card
              key={mission.id}
              className="bg-card border-border p-4 rounded-[1.25rem] flex items-center gap-4 hover:bg-card/80 transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-full border-2 ${mission.color.replace('text', 'border')} flex items-center justify-center flex-shrink-0`}>
                <mission.Icon className={`w-5 h-5 ${mission.color}`} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <p className="text-base font-light text-foreground">{mission.title}</p>
                <p className={`text-xs font-light ${mission.color}`}>{mission.category}</p>
              </div>
            </Card>
          ))}
        </div>
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

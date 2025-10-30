import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame, Pause, Sparkles, Shield } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

const Home = () => {
  const navigate = useNavigate();

  const missions = [
    { id: 1, title: "Pause before saying yes to something", category: "gut trust", color: "text-cyan-500", Icon: Pause },
    { id: 2, title: "Notice one body signal today", category: "awareness", color: "text-purple-500", Icon: Sparkles },
    { id: 3, title: "Honor a no that feels right", category: "boundaries", color: "text-green-500", Icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <h1 className="text-4xl font-cursive text-foreground tracking-tight">Hara</h1>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium">0</span>
        </div>
      </div>

      {/* Today's Focus Card */}
      <div className="px-6 mb-8">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-light">
          today's focus
        </h2>
        <Card className="bg-card border-border p-5 rounded-[1.25rem] flex items-start justify-between gap-4">
          <p className="text-base font-light text-foreground leading-relaxed">
            return to your center — where calm decisions are born
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
          {/* Outer glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/30 to-secondary/30 rounded-full blur-3xl animate-pulse" />
          
          {/* Main orb */}
          <button
            onClick={() => navigate("/check-in?mode=voice")}
            className="relative w-56 h-56 rounded-full bg-gradient-to-br from-primary/90 via-accent/90 to-secondary/90 flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
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
            level 1 <span className="text-muted-foreground">•</span> the listener
          </p>
          <p className="text-xs text-muted-foreground font-light">0 days together</p>
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
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;

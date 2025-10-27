import { TrendingUp, Users, Activity } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GutMap = () => {
  const signals = [
    { name: "Tight chest", count: 12, outcome: "80% misaligned", color: "gut-tight" },
    { name: "Dropped stomach", count: 8, outcome: "65% unclear", color: "gut-dropped" },
    { name: "Warm feeling", count: 15, outcome: "90% aligned", color: "gut-warm" },
  ];

  const trustScore = 67;

  return (
    <div className="min-h-screen bg-gradient-calm pb-20">
      <div className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Your Gut Map</h1>
          <p className="text-muted-foreground">Pattern insights from your journey</p>
        </div>

        {/* Trust Curve */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trust Curve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Honored vs Ignored</span>
                <span className="text-2xl font-bold text-primary">{trustScore}%</span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${trustScore}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                You're building trust with your intuition. Keep listening.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Body Signals */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-primary" />
              Top Signals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {signals.map((signal) => (
              <div
                key={signal.name}
                className="p-4 rounded-xl bg-background/50 border border-border"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-${signal.color}`} />
                    <span className="font-medium text-foreground">{signal.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{signal.count} times</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{signal.outcome}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tone Patterns */}
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Users className="w-5 h-5 text-primary" />
              Tone Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-background/50 border border-border">
                <p className="text-sm text-foreground leading-relaxed">
                  You sound <span className="text-accent font-semibold">rushed</span> when ignoring intuition; <span className="text-success font-semibold">calm</span> when honoring it.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-background/50 border border-border">
                <p className="text-sm text-foreground leading-relaxed">
                  Your gut is strongest in the <span className="text-primary font-semibold">morning</span> and after <span className="text-primary font-semibold">quiet moments</span>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default GutMap;

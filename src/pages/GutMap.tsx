import { useState, useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Circle, Droplet, Sparkles, CheckCircle2, AlertTriangle, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const GutMap = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [consequence, setConsequence] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem("gutEntries") || "[]");
    setEntries(storedEntries);
  }, []);

  const updateConsequence = async (index: number) => {
    const updatedEntries = [...entries];
    updatedEntries[index] = {
      ...updatedEntries[index],
      consequence,
      consequenceDate: new Date().toISOString()
    };
    localStorage.setItem("gutEntries", JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
    setSelectedEntry(null);
    setConsequence("");
    
    // Update gamification for consequence tracking
    const { addCheckIn } = await import("@/utils/gamification");
    addCheckIn(0); // Trigger achievement check without adding XP
    
    toast({
      title: "Outcome logged",
      description: "Your pattern is learning from this",
    });
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "aligned":
        return "text-success";
      case "misaligned":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-cursive text-foreground tracking-tight">Inner Map</h1>
          <p className="text-base text-muted-foreground font-light">
            Your gut feeling patterns
          </p>
        </div>

        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card border border-border rounded-[1.25rem]">
            <TabsTrigger value="timeline" className="rounded-[1rem]">Timeline</TabsTrigger>
            <TabsTrigger value="signals" className="rounded-[1rem]">Signals</TabsTrigger>
            <TabsTrigger value="trust" className="rounded-[1rem]">Trust</TabsTrigger>
            <TabsTrigger value="tone" className="rounded-[1rem]">Tone</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4 mt-6">
            {entries.length === 0 ? (
              <Card className="bg-card border-border p-12 rounded-[1.25rem]">
                <div className="text-center space-y-3">
                  <p className="text-lg text-foreground font-light">No entries yet</p>
                  <p className="text-sm text-muted-foreground font-light">
                    Start checking in to see your journey unfold
                  </p>
                </div>
              </Card>
            ) : (
              entries.map((entry, index) => (
                <Card key={index} className="bg-card border-border p-6 rounded-[1.25rem]">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground font-light">
                        {formatDate(entry.timestamp)}
                      </p>
                      <span className="ml-auto text-xs text-muted-foreground">
                        +{entry.xp} XP
                      </span>
                    </div>
                    <div>
                      {entry.mode === "tap" && (
                        <>
                          <p className="text-base font-medium text-foreground mb-1">
                            {entry.context} • {entry.bodySensation}
                          </p>
                          <p className="text-sm text-muted-foreground font-light">
                            Gut: {entry.gutFeeling} • {entry.willIgnore === "no" ? "Honored it" : "Ignored it"}
                          </p>
                          {entry.decision && (
                            <div className="mt-3 space-y-2">
                              <div className="flex items-start gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-foreground font-light italic">
                                  {entry.decision}
                                </p>
                              </div>
                              {entry.consequence && (
                                <div className="pl-6 pt-2 border-l-2 border-primary/20 ml-0.5">
                                  <p className="text-xs text-primary font-medium mb-1">
                                    What happened
                                  </p>
                                  <p className="text-sm text-muted-foreground font-light">
                                    {entry.consequence}
                                  </p>
                                </div>
                              )}
                              {!entry.consequence && (
                                <button
                                  onClick={() => {
                                    setSelectedEntry(index);
                                    setConsequence("");
                                  }}
                                  className="pl-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                                >
                                  <Plus className="w-3.5 h-3.5 group-hover:text-primary transition-colors" />
                                  <span className="font-light">Log outcome</span>
                                </button>
                              )}
                            </div>
                          )}
                        </>
                      )}
                      {entry.mode === "voice" && (
                        <>
                          <p className="text-base font-medium text-foreground mb-1">
                            Voice check: {entry.label}
                          </p>
                          <p className="text-sm text-muted-foreground font-light italic">
                            "{entry.transcript.substring(0, 100)}..."
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Modal for tracking consequence */}
          {selectedEntry !== null && (
            <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-200">
              <Card className="bg-card border-border border-t sm:border rounded-t-[2rem] sm:rounded-[1.5rem] w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300">
                <div className="p-6 space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-xl font-medium text-foreground">
                      Log outcome
                    </h3>
                    <p className="text-sm text-muted-foreground font-light">
                      What happened after your decision?
                    </p>
                  </div>
                  <Textarea
                    value={consequence}
                    onChange={(e) => setConsequence(e.target.value)}
                    placeholder="It worked out because... / I learned that... / The result was..."
                    className="bg-background/50 border-border rounded-2xl min-h-[140px] resize-none focus:bg-background transition-colors"
                    autoFocus
                  />
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() => {
                        setSelectedEntry(null);
                        setConsequence("");
                      }}
                      variant="outline"
                      className="flex-1 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => updateConsequence(selectedEntry)}
                      disabled={!consequence.trim()}
                      className="flex-1 rounded-xl"
                    >
                      Save outcome
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Signals Tab */}
          <TabsContent value="signals" className="space-y-4 mt-6">
            <Card className="bg-card border-border p-6 rounded-[1.25rem]">
              <h3 className="text-lg font-medium text-foreground mb-4">Your Top Signals</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Circle className="w-5 h-5 text-destructive" strokeWidth={1.5} />
                    <span className="text-base text-foreground font-light">Tight chest</span>
                  </div>
                  <span className="text-sm text-muted-foreground">65% accuracy</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Droplet className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    <span className="text-base text-foreground font-light">Dropped stomach</span>
                  </div>
                  <span className="text-sm text-muted-foreground">80% accuracy</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent" strokeWidth={1.5} />
                    <span className="text-base text-foreground font-light">Expanding warmth</span>
                  </div>
                  <span className="text-sm text-muted-foreground">92% accuracy</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Trust Curve Tab */}
          <TabsContent value="trust" className="space-y-4 mt-6">
            <Card className="bg-card border-border p-6 rounded-[1.25rem]">
              <h3 className="text-lg font-medium text-foreground mb-4">Trust Curve</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-foreground font-light">Honored gut feelings</span>
                    <span className="text-sm text-foreground font-medium">45%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full" style={{ width: "45%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-foreground font-light">Ignored gut feelings</span>
                    <span className="text-sm text-foreground font-medium">55%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-muted-foreground rounded-full" style={{ width: "55%" }} />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-light mt-4">
                  Keep checking in to see your pattern evolve over time.
                </p>
              </div>
            </Card>
          </TabsContent>

          {/* Tone Tab */}
          <TabsContent value="tone" className="space-y-4 mt-6">
            <Card className="bg-card border-border p-6 rounded-[1.25rem]">
              <h3 className="text-lg font-medium text-foreground mb-4">Tone Patterns</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-foreground font-medium">When honoring your gut:</p>
                  <p className="text-sm text-muted-foreground font-light">
                    Your voice tends to be calm, grounded, and confident.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-foreground font-medium">When ignoring your gut:</p>
                  <p className="text-sm text-muted-foreground font-light">
                    Your voice often sounds rushed, uncertain, or tense.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground font-light mt-4 italic">
                  Voice analysis coming soon with more check-ins
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default GutMap;

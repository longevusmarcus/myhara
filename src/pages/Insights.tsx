import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, Target, Zap, Heart, Loader2, Brain, Compass, TrendingDown } from "lucide-react";
import { useState, useEffect } from "react";
import { getGamificationData } from "@/utils/gamification";
import { supabase } from "@/integrations/supabase/client";
import { PatternCard } from "@/components/PatternCard";

const Insights = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [showDailyGuidance, setShowDailyGuidance] = useState(false);
  const [hasSeenToday, setHasSeenToday] = useState(false);
  const [dailyGuidance, setDailyGuidance] = useState("");
  const [loadingGuidance, setLoadingGuidance] = useState(false);
  const [patterns, setPatterns] = useState("");
  const [loadingPatterns, setLoadingPatterns] = useState(false);
  const [trustScore, setTrustScore] = useState(0);
  const [weekStats, setWeekStats] = useState({ checkins: 0, honored: 0, decisions: 0 });

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

    // Load patterns if we have enough data
    if (storedEntries.length >= 3) {
      loadPatternAnalysis(storedEntries);
    }
  }, []);

  const loadPatternAnalysis = async (allEntries: any[]) => {
    setLoadingPatterns(true);
    
    try {
      const entriesSummary = allEntries.slice(-10).map((e: any) => ({
        timestamp: e.timestamp,
        mode: e.mode,
        label: e.label || e.gutFeeling,
        transcript: e.transcript || e.description,
        bodySensation: e.bodySensation,
        honored: e.willIgnore === "no",
        aiInsights: e.aiInsights
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
                content: `Analyze these entries and return 2-3 patterns. Return ONLY the JSON array, nothing else:\n\n${JSON.stringify(entriesSummary, null, 2)}`
              }
            ],
            type: "pattern_analysis"
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to load patterns");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let patternText = "";
      let hasValidJSON = false;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  patternText += content;
                  
                  // Try to validate as we go
                  const cleaned = patternText.trim()
                    .replace(/```json\s*/gi, '')
                    .replace(/```\s*/g, '');
                  
                  if (cleaned.includes('[{') && cleaned.includes('}]')) {
                    hasValidJSON = true;
                  }
                  
                  setPatterns(patternText);
                }
              } catch (e) {
                console.error("Parse error:", e);
              }
            }
          }
        }
      }

      // If we didn't get valid JSON after streaming, set an error state
      if (!hasValidJSON) {
        console.log("No valid JSON found in patterns");
        setPatterns("ERROR: Could not parse patterns");
      }
    } catch (error) {
      console.error("Pattern analysis error:", error);
      setPatterns("ERROR: Failed to load patterns");
    } finally {
      setLoadingPatterns(false);
    }
  };

  const handleStartGuidance = async () => {
    setShowDailyGuidance(true);
    setLoadingGuidance(true);
    localStorage.setItem("lastDailyGuidance", new Date().toDateString());
    setHasSeenToday(true);

    try {
      const recentEntries = entries.slice(-7).map((e: any) => ({
        timestamp: e.timestamp,
        mode: e.mode,
        label: e.label || e.gutFeeling,
        transcript: e.transcript || e.description,
        honored: e.willIgnore === "no",
        aiInsights: e.aiInsights
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
                content: `Based on my recent check-ins, provide daily guidance:\n\n${JSON.stringify(recentEntries, null, 2)}`
              }
            ],
            type: "daily_guidance"
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to load guidance");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let guidanceText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = JSON.parse(line.slice(6));
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  guidanceText += content;
                  setDailyGuidance(guidanceText);
                }
              } catch (e) {
                console.error("Parse error:", e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Guidance error:", error);
      setDailyGuidance("Unable to load guidance right now. Try again later.");
    } finally {
      setLoadingGuidance(false);
    }
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
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-primary" />
                <p className="text-lg font-medium text-foreground">Daily Guidance</p>
              </div>
              <p className="text-base font-light text-muted-foreground">
                {hasSeenToday 
                  ? "Come back tomorrow for new personalized guidance"
                  : "Get AI-powered insights based on your recent check-ins"
                }
              </p>
              {!hasSeenToday && (
                <button
                  onClick={handleStartGuidance}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-light transition-colors"
                >
                  Get Today's Guidance
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {loadingGuidance && !dailyGuidance && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <p className="text-sm">Analyzing your patterns...</p>
                </div>
              )}
              {dailyGuidance && (
                <div className="space-y-4 prose prose-sm max-w-none">
                  {dailyGuidance.split('\n').map((line, idx) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <h3 key={idx} className="text-lg font-medium text-foreground mt-4 first:mt-0">
                          {line.replace(/\*\*/g, '')}
                        </h3>
                      );
                    } else if (line.trim()) {
                      return (
                        <p key={idx} className="text-base text-foreground/80 font-light leading-relaxed">
                          {line}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
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
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-foreground">Your Patterns</h2>
            </div>
            
            {loadingPatterns && !patterns && (
              <Card className="bg-card border-border p-8 rounded-2xl">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm">Discovering your intuition patterns...</p>
                </div>
              </Card>
            )}
            
            {patterns && patterns !== "ERROR: Could not parse patterns" && patterns !== "ERROR: Failed to load patterns" && (() => {
              try {
                let cleanedPatterns = patterns.trim();
                
                // Remove markdown artifacts
                cleanedPatterns = cleanedPatterns
                  .replace(/```json\s*/gi, '')
                  .replace(/```\s*/g, '')
                  .replace(/^[^[{]*/,'')
                  .replace(/[^}\]]*$/,'');
                
                // Find JSON array
                const jsonMatch = cleanedPatterns.match(/\[\s*\{[\s\S]*\}\s*\]/);
                
                if (jsonMatch) {
                  let jsonStr = jsonMatch[0];
                  
                  // Fix common issues
                  jsonStr = jsonStr
                    .replace(/,(\s*[}\]])/g, '$1')
                    .replace(/\n/g, ' ')
                    .replace(/\s+/g, ' ');
                  
                  const patternData = JSON.parse(jsonStr);
                  
                  if (Array.isArray(patternData) && patternData.length > 0) {
                    const icons = [Brain, Compass, Zap];
                    const colors = ["primary", "accent", "primary"];
                    
                    return (
                      <div className="space-y-3 animate-fade-in">
                        {patternData.map((pattern: any, idx: number) => {
                          const Icon = icons[idx % icons.length];
                          const color = colors[idx % colors.length];
                          
                          return (
                            <PatternCard
                              key={idx}
                              title={pattern.title || "Pattern Discovered"}
                              observation={pattern.observation || ""}
                              intuitionGuide={pattern.intuitionGuide || ""}
                              relatedEntries={Array.isArray(pattern.relatedEntries) ? pattern.relatedEntries : []}
                              questions={Array.isArray(pattern.questions) ? pattern.questions : []}
                              icon={<Icon className={`w-5 h-5 ${color === "accent" ? "text-accent" : "text-primary"}`} />}
                              accentColor={color}
                            />
                          );
                        })}
                      </div>
                    );
                  }
                }
              } catch (e) {
                console.error("Failed to parse patterns:", e);
                console.log("Raw patterns:", patterns.substring(0, 500));
              }
              
              // Still processing
              return null;
            })()}
            
            {(loadingPatterns || (patterns && !patterns.startsWith("ERROR") && patterns.indexOf('[{') === -1)) && (
              <Card className="bg-card border-border p-8 rounded-2xl">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm">Analyzing your patterns...</p>
                </div>
              </Card>
            )}
            
            {patterns && patterns.startsWith("ERROR") && (
              <Card className="bg-card border-border p-6 rounded-2xl">
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Unable to analyze patterns right now. Please try again later.
                  </p>
                  <button
                    onClick={() => {
                      setPatterns("");
                      loadPatternAnalysis(entries);
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    Retry Analysis
                  </button>
                </div>
              </Card>
            )}
            
            {!loadingPatterns && !patterns && (
              <Card className="bg-card border-border p-8 rounded-2xl">
                <div className="text-center">
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

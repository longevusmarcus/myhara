import BottomNav from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const GutMap = () => {
  const entries = [
    {
      date: "Today, 9:14 AM",
      feeling: "Calm & aligned",
      note: "Started the day with clarity about the meeting.",
      outcome: "aligned",
    },
    {
      date: "Yesterday, 2:30 PM",
      feeling: "Uneasy tension",
      note: "Something felt off about that proposal.",
      outcome: "misaligned",
    },
    {
      date: "2 days ago",
      feeling: "Unclear signal",
      note: "Couldn't read the situation clearly.",
      outcome: "neutral",
    },
  ];

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

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-medium text-foreground">Journey</h1>
          <p className="text-base text-muted-foreground font-light">
            Your gut feeling timeline
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <Card key={index} className="bg-card border-border p-6 rounded-3xl">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground font-light">{entry.date}</p>
                </div>
                <div>
                  <p className="text-base font-medium text-foreground mb-1">
                    {entry.feeling}
                  </p>
                  <p className="text-sm text-muted-foreground font-light leading-relaxed">
                    {entry.note}
                  </p>
                </div>
                <div className="pt-2 border-t border-border">
                  <p className={`text-sm font-light ${getOutcomeColor(entry.outcome)}`}>
                    {entry.outcome === "aligned" && "✓ Outcome aligned"}
                    {entry.outcome === "misaligned" && "✗ Outcome misaligned"}
                    {entry.outcome === "neutral" && "— Neutral outcome"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State for older entries */}
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground font-light">
            Start checking in daily to see your journey unfold
          </p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default GutMap;

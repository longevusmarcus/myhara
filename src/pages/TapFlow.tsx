import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, Droplets, Sparkles, Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const TapFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSignal, setSelectedSignal] = useState("");
  const [gutFeeling, setGutFeeling] = useState("");

  const categories = [
    { id: "work", label: "Work", color: "from-primary to-gut-dropped" },
    { id: "relationship", label: "Relationship", color: "from-accent to-gut-warm" },
    { id: "social", label: "Social", color: "from-gut-dropped to-primary" },
    { id: "health", label: "Health", color: "from-success to-gut-warm" },
  ];

  const bodySignals = [
    { id: "tight", label: "Tight chest", icon: Flame, color: "gut-tight" },
    { id: "dropped", label: "Dropped stomach", icon: Droplets, color: "gut-dropped" },
    { id: "warm", label: "Expanding warmth", icon: Sparkles, color: "gut-warm" },
    { id: "numb", label: "Numb", icon: Cloud, color: "gut-numb" },
  ];

  const handleComplete = (ignoring: boolean) => {
    const xpGained = ignoring ? 3 : 5;
    toast({
      title: "Gut Check Complete",
      description: `+${xpGained} XP — You checked in.`,
    });
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col p-6 pb-24">
      <button
        onClick={() => (step > 1 ? setStep(step - 1) : navigate("/home"))}
        className="self-start mb-6 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full animate-fade-in-up">
        {step === 1 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground text-center">
              What's happening?
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setStep(2);
                  }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${cat.color} shadow-card hover:scale-105 transition-transform`}
                >
                  <span className="text-white font-semibold text-lg">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground text-center">
              What does your body feel?
            </h2>
            <div className="space-y-4">
              {bodySignals.map((signal) => {
                const Icon = signal.icon;
                return (
                  <button
                    key={signal.id}
                    onClick={() => {
                      setSelectedSignal(signal.id);
                      setStep(3);
                    }}
                    className="w-full p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:scale-102 flex items-center gap-4"
                  >
                    <div className={`w-12 h-12 rounded-full bg-${signal.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-foreground font-medium text-lg">{signal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground text-center">
              What's your gut saying?
            </h2>
            <div className="space-y-4">
              {[
                { id: "yes", label: "✅ Yes — feels right", color: "success" },
                { id: "no", label: "🚫 No — something's off", color: "gut-tight" },
                { id: "pause", label: "⏸️ Pause — not sure yet", color: "gut-numb" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setGutFeeling(option.id);
                    setStep(4);
                  }}
                  className={`w-full p-6 rounded-2xl bg-card border-2 border-border hover:border-${option.color} transition-all hover:scale-102`}
                >
                  <span className="text-foreground font-medium text-lg">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground text-center">
              Are you about to ignore it?
            </h2>
            <div className="space-y-4">
              <Button
                onClick={() => handleComplete(true)}
                variant="outline"
                size="lg"
                className="w-full h-16 text-lg"
              >
                Yes
              </Button>
              <Button
                onClick={() => handleComplete(false)}
                size="lg"
                className="w-full h-16 text-lg bg-gradient-primary hover:opacity-90"
              >
                No — I'll honor it
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TapFlow;

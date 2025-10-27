import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, TrendingUp } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);

  const screens = [
    {
      icon: Heart,
      title: "Listen to Your Body",
      description: "Your gut knows things your mind hasn't figured out yet. Let's learn to hear it.",
      gradient: "from-primary to-accent",
    },
    {
      icon: Sparkles,
      title: "Voice or Touch",
      description: "Speak freely or tap quickly. Express your gut feelings however feels right.",
      gradient: "from-primary to-gut-dropped",
    },
    {
      icon: TrendingUp,
      title: "Track Patterns",
      description: "See how your body's signals connect to outcomes. Build trust in your intuition.",
      gradient: "from-gut-dropped to-success",
    },
  ];

  const currentScreen = screens[step];
  const Icon = currentScreen.icon;

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col items-center justify-center p-8 pb-24">
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-8 animate-fade-in-up">
        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${currentScreen.gradient} flex items-center justify-center shadow-glow`}>
          <Icon className="w-16 h-16 text-white" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            {currentScreen.title}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {currentScreen.description}
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          {screens.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === step ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="w-full pt-8">
          {step < screens.length - 1 ? (
            <Button
              onClick={() => setStep(step + 1)}
              size="lg"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg h-14"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={onComplete}
              size="lg"
              className="w-full bg-gradient-primary hover:opacity-90 transition-opacity text-lg h-14"
            >
              Start Your Journey
            </Button>
          )}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

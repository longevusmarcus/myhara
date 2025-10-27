import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, TrendingUp } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);

  const screens = [
    {
      icon: Heart,
      title: "meet gut.",
      subtitle: "your intuition companion",
      description: "Learn to recognize and trust your body's signals through daily reflection.",
    },
    {
      icon: Calendar,
      title: "daily check-ins.",
      subtitle: "build the habit",
      description: "Quick voice or touch logging makes it easy to track your gut feelings anytime.",
    },
    {
      icon: TrendingUp,
      title: "discover patterns.",
      subtitle: "trust your instincts",
      description: "See how your body's wisdom connects to real outcomes over time.",
    },
  ];

  const currentScreen = screens[step];
  const Icon = currentScreen.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6 pb-10">
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 animate-fade-in max-w-sm mx-auto">
        <div className="w-40 h-40 rounded-full bg-secondary/50 flex items-center justify-center">
          <Icon className="w-20 h-20 text-foreground stroke-[1.5]" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            {currentScreen.title}
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            {currentScreen.subtitle}
          </p>
          <p className="text-base text-muted-foreground leading-relaxed pt-2 font-light">
            {currentScreen.description}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {screens.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === step ? "w-8 bg-foreground" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>

        {step < screens.length - 1 ? (
          <Button
            onClick={() => setStep(step + 1)}
            size="lg"
            className="w-full h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium"
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={onComplete}
            size="lg"
            className="w-full h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 font-medium"
          >
            Start Journey
          </Button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;

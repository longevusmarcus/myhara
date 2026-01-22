import { useState } from "react";
import { Heart, Sparkles, Brain, TrendingUp, DollarSign, Users, Target, Frown, MessageSquareOff, AlertCircle, ShieldAlert, Zap, CheckCircle2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoiceBubbleLogo from "./VoiceBubbleLogo";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoalSelect = (goal: string) => {
    setSelectedGoal(goal);
    setTimeout(() => setStep(step + 1), 300);
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment');
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      setIsLoading(false);
    }
  };

  // Step 1: Science Introduction
  if (step === 1) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-700">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-secondary" />
              <span className="text-sm text-secondary font-light">Science-Based</span>
            </div>
            
            <h1 className="text-3xl font-cursive text-foreground mb-4">
              Built on what psychology and science say works
            </h1>
            
            <p className="text-base text-muted-foreground/70 font-light mb-8">
              Your gut instinct processes information faster than conscious thought, backed by neuroscience research
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-card/40 border border-border/30 rounded-[1rem]">
                <Brain className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground/80 font-light text-left">
                  Your enteric nervous system has 100 million neurons
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card/40 border border-border/30 rounded-[1rem]">
                <Heart className="w-5 h-5 text-accent flex-shrink-0" />
                <p className="text-sm text-foreground/80 font-light text-left">
                  90% of serotonin (your mood regulator) is made in your gut
                </p>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card/40 border border-border/30 rounded-[1rem]">
                <TrendingUp className="w-5 h-5 text-secondary flex-shrink-0" />
                <p className="text-sm text-foreground/80 font-light text-left">
                  Studies show gut feelings improve decision accuracy by 40%
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full rounded-[1rem] h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Step 2: OCD vs Intuition
  if (step === 2) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-3xl w-full animate-in fade-in zoom-in duration-700">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Left Side - Intrusive Thoughts */}
            <div className="bg-card/30 border border-destructive/20 rounded-[1.5rem] p-6">
              <div className="flex items-center gap-2 mb-6">
                <ShieldAlert className="w-5 h-5 text-destructive" />
                <h3 className="text-lg font-light text-foreground">
                  INTRUSIVE THOUGHTS
                </h3>
              </div>
              <p className="text-xs text-muted-foreground/60 font-light mb-4">(OCD)</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive/60 mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 font-light">
                    Feel repetitive, obsessive, unwanted
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive/60 mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 font-light">
                    Create anxiety and demand reassurance
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive/60 mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 font-light">
                    Hard to ignore, stay in your head
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive/60 mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 font-light">
                    Are based on fear, not wisdom
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Gut Feelings */}
            <div className="bg-card/30 border border-primary/20 rounded-[1.5rem] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-light text-foreground">
                  GUT FEELINGS
                </h3>
              </div>
              <p className="text-xs text-muted-foreground/60 font-light mb-4">(INTUITION)</p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 font-light">
                    Feel calm, clear, and grounded
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 font-light">
                    Don't demand constant analysis
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 font-light">
                    Come quickly with aligned action, not panic
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground/80 font-light">
                    Are based on wisdom, not panic
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setStep(3)}
            className="w-full rounded-[1rem] h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Learn to trust your gut
          </Button>
        </div>
      </div>
    );
  }

  // Step 3: Goal Selection
  if (step === 3) {
    const goals = [
      { id: "financial", icon: DollarSign, label: "Better financial decisions", color: "text-secondary" },
      { id: "relationships", icon: Users, label: "Healthier relationships", color: "text-secondary" },
      { id: "career", icon: Target, label: "Career & purpose clarity", color: "text-secondary" }
    ];

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-foreground mb-3">
              What would you like to improve?
            </h2>
            <p className="text-sm text-muted-foreground/70 font-light">
              Choose your primary focus
            </p>
          </div>

          <div className="space-y-3">
            {goals.map((goal) => {
              const IconComponent = goal.icon;
              return (
                <button
                  key={goal.id}
                  onClick={() => handleGoalSelect(goal.id)}
                  className={`w-full p-5 bg-card/40 border border-border/30 rounded-[1.25rem] flex items-center gap-4 hover:bg-card/60 transition-all hover:scale-[1.02] ${
                    selectedGoal === goal.id ? "border-primary bg-primary/10" : ""
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-card/60 ${goal.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-base text-foreground font-light">{goal.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Step 4: Common Challenge
  if (step === 4) {
    const challengesByGoal: Record<string, Array<{ id: string; icon: any; label: string; color: string }>> = {
      financial: [
        { id: "ignore-warnings", icon: AlertCircle, label: "Ignoring gut warnings about risky decisions", color: "text-secondary" },
        { id: "follow-others", icon: Users, label: "Following others' advice against my instinct", color: "text-secondary" },
        { id: "fear-override", icon: Frown, label: "Letting fear override gut feelings about opportunities", color: "text-secondary" }
      ],
      relationships: [
        { id: "ignore-red-flags", icon: AlertCircle, label: "Ignoring red flags my gut is showing me", color: "text-secondary" },
        { id: "stay-despite-warning", icon: Frown, label: "Staying despite gut warnings something is off", color: "text-secondary" },
        { id: "dismiss-intuition", icon: MessageSquareOff, label: "Dismissing my intuition about people", color: "text-secondary" }
      ],
      career: [
        { id: "ignore-opportunities", icon: AlertCircle, label: "Ignoring gut pulls toward certain paths", color: "text-secondary" },
        { id: "safe-path", icon: Frown, label: "Taking the 'safe path' against my instinct", color: "text-secondary" },
        { id: "dismiss-calling", icon: MessageSquareOff, label: "Dismissing intuitive feelings about my calling", color: "text-secondary" }
      ]
    };

    const challenges = challengesByGoal[selectedGoal] || challengesByGoal.financial;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-light text-foreground mb-3">
              Which challenge resonates most?
            </h2>
            <p className="text-sm text-muted-foreground/70 font-light">
              We'll help you tackle this first
            </p>
          </div>

          <div className="space-y-3">
            {challenges.map((challenge) => {
              const IconComponent = challenge.icon;
              return (
                <button
                  key={challenge.id}
                  onClick={() => {
                    setSelectedGoal(challenge.id);
                    setTimeout(() => setStep(5), 300);
                  }}
                  className="w-full p-5 bg-card/40 border border-border/30 rounded-[1.25rem] flex items-center gap-4 hover:bg-card/60 transition-all hover:scale-[1.02] text-left"
                >
                  <div className={`p-2 rounded-lg bg-card/60 flex-shrink-0 ${challenge.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-base text-foreground font-light">{challenge.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Step 5: How It Works
  if (step === 5) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full animate-in fade-in zoom-in duration-700">
          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <VoiceBubbleLogo size="md" animated={true} />
            </div>
            
            <h2 className="text-2xl font-cursive text-foreground mb-4">
              How Hara works
            </h2>
            
            <p className="text-base text-muted-foreground/70 font-light mb-8">
              Train your intuition through science-backed practice
            </p>

            <div className="space-y-4 text-left mb-8">
              <div className="p-4 bg-card/40 border border-border/30 rounded-[1rem]">
                <p className="text-sm font-light text-foreground/60 mb-1">Step 1</p>
                <p className="text-base text-foreground font-light">
                  Check in when you feel a gut signal
                </p>
              </div>
              <div className="p-4 bg-card/40 border border-border/30 rounded-[1rem]">
                <p className="text-sm font-light text-foreground/60 mb-1">Step 2</p>
                <p className="text-base text-foreground font-light">
                  Track what happens when you honor vs ignore it
                </p>
              </div>
              <div className="p-4 bg-card/40 border border-border/30 rounded-[1rem]">
                <p className="text-sm font-light text-foreground/60 mb-1">Step 3</p>
                <p className="text-base text-foreground font-light">
                  Build trust through pattern recognition
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setStep(6)}
            className="w-full rounded-[1rem] h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  // Step 6: Elegant Stripe Paywall
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      {/* Close button */}
      <button 
        onClick={() => setStep(5)} 
        className="absolute top-6 right-6 p-2 text-muted-foreground/50 hover:text-foreground transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="max-w-md w-full animate-in fade-in zoom-in duration-700">
        {/* Early Founders Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-8">
            <Sparkles className="w-4 h-4 text-muted-foreground/60" />
            <span className="text-xs tracking-[0.3em] uppercase text-muted-foreground/60 font-light">
              Early Founders
            </span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-3xl font-light text-foreground mb-1">
            Unlock Your
          </h1>
          <h2 className="text-3xl font-cursive italic text-foreground/80 mb-6">
            Full Intuition Potential
          </h2>
          
          <p className="text-base text-muted-foreground/50 font-light">
            Join the founding members trusting their gut with science-backed insights
          </p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-8">
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-2xl text-muted-foreground/40 line-through font-light">$49</span>
            <span className="text-5xl font-light text-foreground">$4.99</span>
            <span className="text-lg text-muted-foreground/60 font-light">/lifetime</span>
          </div>
          <p className="text-sm text-muted-foreground/40 font-light">
            One-time payment, forever access
          </p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-10">
          {[
            "Unlimited gut check-ins & tracking",
            "AI-powered intuition coaching",
            "Pattern recognition insights",
            "Personalized daily reflections",
            "Voice & tap journaling modes",
            "Lifetime access to all features"
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary/70 flex-shrink-0" />
              <span className="text-base text-foreground/70 font-light">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full rounded-full h-14 bg-foreground hover:bg-foreground/90 text-background text-base font-normal"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Start Your Journey"
          )}
        </Button>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/40 font-light mt-6">
          Secure payment via Stripe
        </p>
      </div>
    </div>
  );
};

export default Onboarding;

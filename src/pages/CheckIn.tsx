import { useState } from "react";
import { ArrowLeft, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const CheckIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"choice" | "voice" | "tap">("choice");
  const [isRecording, setIsRecording] = useState(false);

  const handleVoiceRecord = () => {
    setStep("voice");
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      toast({
        title: "Check-in saved",
        description: "Your gut feeling has been recorded.",
      });
      navigate("/home");
    }, 3000);
  };

  const handleQuickTap = () => {
    setStep("tap");
  };

  const handleComplete = () => {
    toast({
      title: "Check-in complete",
      description: "Great job listening to your intuition today.",
    });
    navigate("/home");
  };

  if (step === "voice") {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6">
        <button onClick={() => navigate("/home")} className="self-start mb-8">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-12">
          <p className="text-xl text-muted-foreground font-light">
            Speak freely — what's your body saying?
          </p>

          <div className="relative">
            <div className={`w-48 h-48 rounded-full bg-secondary flex items-center justify-center ${
              isRecording ? "animate-pulse" : ""
            }`}>
              <Mic className="w-16 h-16 text-foreground" />
            </div>
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-2 border-foreground/20 animate-ping" />
            )}
          </div>

          {isRecording && (
            <p className="text-base text-foreground font-medium">Listening...</p>
          )}
        </div>
      </div>
    );
  }

  if (step === "tap") {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6">
        <button onClick={() => setStep("choice")} className="self-start mb-8">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
          <h2 className="text-2xl font-medium text-foreground">
            How does your body feel right now?
          </h2>

          <div className="space-y-3">
            {[
              { emoji: "😌", label: "Calm & aligned", color: "success" },
              { emoji: "😟", label: "Uneasy tension", color: "accent" },
              { emoji: "🤔", label: "Unclear signal", color: "muted" },
              { emoji: "😐", label: "Numb or distant", color: "muted" },
            ].map((feeling) => (
              <Card
                key={feeling.label}
                onClick={handleComplete}
                className="bg-card border-border p-6 cursor-pointer hover:bg-card/80 transition-colors rounded-2xl"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{feeling.emoji}</span>
                  <span className="text-base text-foreground font-light">{feeling.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      <button onClick={() => navigate("/home")} className="self-start mb-8">
        <ArrowLeft className="w-6 h-6 text-foreground" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-medium text-foreground">
            How would you like to check in?
          </h1>
          <p className="text-base text-muted-foreground font-light">
            Choose your preferred way to log your gut feeling.
          </p>
        </div>

        <div className="space-y-4">
          <Card
            onClick={handleVoiceRecord}
            className="bg-card border-border p-8 cursor-pointer hover:bg-card/80 transition-colors rounded-3xl"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Mic className="w-8 h-8 text-foreground" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium text-foreground mb-1">Voice Check-in</h3>
                <p className="text-sm text-muted-foreground font-light">
                  Speak your thoughts and feelings freely
                </p>
              </div>
            </div>
          </Card>

          <Card
            onClick={handleQuickTap}
            className="bg-card border-border p-8 cursor-pointer hover:bg-card/80 transition-colors rounded-3xl"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">👆</span>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium text-foreground mb-1">Quick Tap</h3>
                <p className="text-sm text-muted-foreground font-light">
                  Fast, discreet body signal logging
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;

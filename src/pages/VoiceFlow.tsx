import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const VoiceFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Simulate recording start
    setIsRecording(true);
    const timer = setTimeout(() => {
      setIsRecording(false);
      setTranscript("My stomach just twisted when I got this message from my boss. I don't know why.");
      setStep(2);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    toast({
      title: "Voice Check Complete",
      description: "+10 XP — Honest Voice Check.",
    });
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col p-6 pb-24">
      <button
        onClick={() => navigate("/home")}
        className="self-start mb-6 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {step === 1 && (
          <div className="space-y-12 text-center animate-fade-in-up">
            <p className="text-xl text-muted-foreground">
              Speak freely — what's your body saying?
            </p>

            <div className="relative">
              <div className="w-48 h-48 mx-auto rounded-full bg-gradient-primary shadow-glow flex items-center justify-center animate-pulse-glow">
                <Mic className="w-24 h-24 text-white" />
              </div>
              
              {isRecording && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
                  <div className="flex justify-center gap-2 mt-8">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-12 bg-primary rounded-full animate-wave"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {isRecording && (
              <p className="text-lg text-primary font-medium animate-pulse">
                Listening...
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <p className="text-foreground leading-relaxed">{transcript}</p>
            </div>

            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                It sounds like your tone had a bit of tension.
                <br />
                Would you label this moment as:
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => setStep(3)}
                  variant="outline"
                  size="lg"
                  className="w-full h-14 text-lg"
                >
                  ⚡ Unease
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  variant="outline"
                  size="lg"
                  className="w-full h-14 text-lg"
                >
                  🌊 Unclear
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  variant="outline"
                  size="lg"
                  className="w-full h-14 text-lg"
                >
                  🌞 Aligned
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <p className="text-foreground leading-relaxed">
                "You could say, 'Let me think and get back to you' — that usually helps you honor your pause."
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleComplete}
                size="lg"
                className="w-full h-14 text-lg bg-gradient-primary hover:opacity-90"
              >
                Log & Continue
              </Button>
              <Button
                onClick={handleComplete}
                variant="outline"
                size="lg"
                className="w-full h-14 text-lg"
              >
                Just Record Signal
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceFlow;

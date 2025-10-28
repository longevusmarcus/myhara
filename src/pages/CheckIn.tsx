import { useState, useEffect } from "react";
import { ArrowLeft, Mic } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type TapStep = "context" | "body" | "gut" | "ignore";
type VoiceStep = "recording" | "processing" | "label" | "response";

const CheckIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "tap";

  // Tap Flow State
  const [tapStep, setTapStep] = useState<TapStep>("context");
  const [context, setContext] = useState("");
  const [customNote, setCustomNote] = useState("");
  const [bodySensation, setBodySensation] = useState("");
  const [customSensation, setCustomSensation] = useState("");
  const [gutFeeling, setGutFeeling] = useState("");
  const [willIgnore, setWillIgnore] = useState("");

  // Voice Flow State
  const [voiceStep, setVoiceStep] = useState<VoiceStep>("recording");
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [wantsResponse, setWantsResponse] = useState<boolean | null>(null);

  useEffect(() => {
    if (mode === "voice") {
      startVoiceRecording();
    }
  }, [mode]);

  const startVoiceRecording = () => {
    setIsRecording(true);
    // Simulate voice recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setTranscript("My stomach just twisted when I got this message from my boss. I don't know why.");
      setVoiceStep("processing");
      
      // Simulate AI processing
      setTimeout(() => {
        setVoiceStep("label");
      }, 1500);
    }, 3000);
  };

  const handleTapComplete = () => {
    const entry = {
      mode: "tap",
      context,
      customNote,
      bodySensation: bodySensation || customSensation,
      gutFeeling,
      willIgnore,
      timestamp: new Date().toISOString(),
      xp: 5
    };
    
    // Save to localStorage
    const entries = JSON.parse(localStorage.getItem("gutEntries") || "[]");
    entries.push(entry);
    localStorage.setItem("gutEntries", JSON.stringify(entries));
    
    toast({
      title: "+5 XP",
      description: "You checked in.",
    });
    navigate("/map");
  };

  const handleVoiceComplete = () => {
    const entry = {
      mode: "voice",
      transcript,
      label: selectedLabel,
      wantsResponse,
      timestamp: new Date().toISOString(),
      xp: 10
    };
    
    // Save to localStorage
    const entries = JSON.parse(localStorage.getItem("gutEntries") || "[]");
    entries.push(entry);
    localStorage.setItem("gutEntries", JSON.stringify(entries));
    
    toast({
      title: "+10 XP",
      description: "Honest Voice Check.",
    });
    navigate("/map");
  };

  // Voice Flow Render
  if (mode === "voice") {
    if (voiceStep === "recording" || voiceStep === "processing") {
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
            {voiceStep === "processing" && (
              <p className="text-base text-foreground font-medium">Processing...</p>
            )}
          </div>
        </div>
      );
    }

    if (voiceStep === "label") {
      return (
        <div className="min-h-screen bg-background flex flex-col p-6">
          <button onClick={() => setVoiceStep("recording")} className="self-start mb-8">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
            <div className="space-y-4">
              <p className="text-base text-muted-foreground font-light italic">
                "{transcript}"
              </p>
              <p className="text-lg text-foreground font-light">
                It sounds like your tone had a bit of tension. Would you label this moment as:
              </p>
            </div>

            <div className="space-y-3">
              {[
                { emoji: "⚡", label: "Unease", value: "unease" },
                { emoji: "🌊", label: "Unclear", value: "unclear" },
                { emoji: "🌞", label: "Aligned", value: "aligned" },
              ].map((option) => (
                <Card
                  key={option.value}
                  onClick={() => {
                    setSelectedLabel(option.value);
                    setVoiceStep("response");
                  }}
                  className="bg-card border-border p-6 cursor-pointer hover:bg-card/80 transition-colors rounded-[1.25rem]"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="text-base text-foreground font-light">{option.label}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (voiceStep === "response") {
      return (
        <div className="min-h-screen bg-background flex flex-col p-6">
          <button onClick={() => setVoiceStep("label")} className="self-start mb-8">
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>

          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
            <p className="text-lg text-foreground font-light">
              Got it. Do you want to note how you'll respond or just record the signal?
            </p>

            <div className="space-y-3">
              <Card
                onClick={() => {
                  setWantsResponse(true);
                  setTimeout(() => handleVoiceComplete(), 2000);
                }}
                className="bg-card border-border p-6 cursor-pointer hover:bg-card/80 transition-colors rounded-[1.25rem]"
              >
                <p className="text-base text-foreground font-light">Note my response</p>
                <p className="text-sm text-muted-foreground font-light mt-2">
                  "You could say, 'Let me think and get back to you' — that usually helps you honor your pause."
                </p>
              </Card>

              <Card
                onClick={() => {
                  setWantsResponse(false);
                  handleVoiceComplete();
                }}
                className="bg-card border-border p-6 cursor-pointer hover:bg-card/80 transition-colors rounded-[1.25rem]"
              >
                <p className="text-base text-foreground font-light">Just record the signal</p>
              </Card>
            </div>
          </div>
        </div>
      );
    }
  }

  // Tap Flow Render
  if (tapStep === "context") {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6">
        <button onClick={() => navigate("/home")} className="self-start mb-8">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
          <h2 className="text-2xl font-medium text-foreground">
            What's happening?
          </h2>

          <div className="space-y-3">
            {["Work", "Relationship", "Social", "Health", "Other"].map((option) => (
              <Card
                key={option}
                onClick={() => {
                  setContext(option);
                  setTapStep("body");
                }}
                className="bg-card border-border p-6 cursor-pointer hover:bg-card/80 transition-colors rounded-[1.25rem]"
              >
                <span className="text-base text-foreground font-light">{option}</span>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-light">Or add a custom note (5 words max):</p>
            <Input
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && customNote.trim()) {
                  setContext("Custom");
                  setTapStep("body");
                }
              }}
              placeholder="Type here..."
              className="bg-card border-border rounded-[1.25rem]"
            />
          </div>
        </div>
      </div>
    );
  }

  if (tapStep === "body") {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6">
        <button onClick={() => setTapStep("context")} className="self-start mb-8">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
          <h2 className="text-2xl font-medium text-foreground">
            What does your body feel?
          </h2>

          <div className="space-y-3">
            {[
              { emoji: "🔴", label: "Tight chest" },
              { emoji: "💧", label: "Dropped stomach" },
              { emoji: "✨", label: "Expanding warmth" },
              { emoji: "🌫️", label: "Numb" },
            ].map((option) => (
              <Card
                key={option.label}
                onClick={() => {
                  setBodySensation(option.label);
                  setTapStep("gut");
                }}
                className="bg-card border-border p-6 cursor-pointer hover:bg-card/80 transition-colors rounded-[1.25rem]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="text-base text-foreground font-light">{option.label}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <Card className="bg-card border-border p-6 rounded-[1.25rem]">
              <p className="text-sm text-muted-foreground font-light mb-2">➕ Add your own signal:</p>
              <Input
                value={customSensation}
                onChange={(e) => setCustomSensation(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && customSensation.trim()) {
                    setBodySensation("");
                    setTapStep("gut");
                  }
                }}
                placeholder="Describe what you feel..."
                className="bg-background border-border rounded-[1.25rem]"
              />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (tapStep === "gut") {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6">
        <button onClick={() => setTapStep("body")} className="self-start mb-8">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
          <h2 className="text-2xl font-medium text-foreground">
            What's your gut saying?
          </h2>

          <div className="space-y-3">
            {[
              { emoji: "✅", label: "Yes (feels right)", value: "yes" },
              { emoji: "🚫", label: "No (something's off)", value: "no" },
              { emoji: "⏸", label: "Pause (not sure yet)", value: "pause" },
            ].map((option) => (
              <Card
                key={option.value}
                onClick={() => {
                  setGutFeeling(option.value);
                  setTapStep("ignore");
                }}
                className="bg-card border-border p-6 cursor-pointer hover:bg-card/80 transition-colors rounded-[1.25rem]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="text-base text-foreground font-light">{option.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tapStep === "ignore") {
    return (
      <div className="min-h-screen bg-background flex flex-col p-6">
        <button onClick={() => setTapStep("gut")} className="self-start mb-8">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-8">
          <h2 className="text-2xl font-medium text-foreground">
            Are you about to ignore it?
          </h2>

          <div className="space-y-3">
            <Card
              onClick={() => {
                setWillIgnore("yes");
                handleTapComplete();
              }}
              className="bg-card border-border p-6 cursor-pointer hover:bg-card/80 transition-colors rounded-[1.25rem]"
            >
              <span className="text-base text-foreground font-light">Yes</span>
            </Card>

            <Card
              onClick={() => {
                setWillIgnore("no");
                handleTapComplete();
              }}
              className="bg-card border-border p-6 cursor-pointer hover:bg-card/80 transition-colors rounded-[1.25rem]"
            >
              <span className="text-base text-foreground font-light">No</span>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CheckIn;

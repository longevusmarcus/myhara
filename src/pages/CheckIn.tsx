import { useState, useEffect } from "react";
import { ArrowLeft, Mic, Zap, Waves, Sun, Circle, Droplet, Sparkles, Cloud, CheckCircle, XCircle, Pause, Plus } from "lucide-react";
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

            <div className="relative flex items-center justify-center">
              {/* Outer glow ring */}
              <div 
                className={`absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl ${
                  isRecording ? 'animate-pulse' : ''
                }`}
                style={{
                  animation: isRecording ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                }}
              />
              
              {/* Middle glow ring */}
              <div 
                className={`absolute w-56 h-56 rounded-full bg-primary/10 blur-2xl ${
                  isRecording ? 'animate-pulse' : ''
                }`}
                style={{
                  animation: isRecording ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.1s' : 'none'
                }}
              />

              {/* Main orb with heart pump animation */}
              <div 
                className="relative w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 via-primary/30 to-primary/40 backdrop-blur-sm border border-primary/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] flex items-center justify-center"
                style={{
                  animation: isRecording 
                    ? 'heartPump 1.2s ease-in-out infinite' 
                    : 'none',
                  transformOrigin: 'center'
                }}
              >
                {/* Inner glow */}
                <div className="absolute inset-8 rounded-full bg-primary/10 blur-xl" />
                
                {/* Mic icon */}
                <Mic className="w-16 h-16 text-primary relative z-10" />
              </div>

              {/* Pulsing rings */}
              {isRecording && (
                <>
                  <div 
                    className="absolute w-48 h-48 rounded-full border border-primary/30"
                    style={{
                      animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                    }}
                  />
                  <div 
                    className="absolute w-48 h-48 rounded-full border border-primary/20"
                    style={{
                      animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s'
                    }}
                  />
                </>
              )}
            </div>

            {!isRecording && (
              <p className="text-sm text-muted-foreground font-light">tap to speak</p>
            )}
            {isRecording && (
              <p className="text-base text-foreground font-medium">Listening...</p>
            )}
            {voiceStep === "processing" && (
              <p className="text-base text-foreground font-medium">Processing...</p>
            )}
          </div>

          <style>{`
            @keyframes heartPump {
              0%, 100% {
                transform: scale(1);
              }
              25% {
                transform: scale(1.05);
              }
              50% {
                transform: scale(1);
              }
              75% {
                transform: scale(1.08);
              }
            }
          `}</style>
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
                { Icon: Zap, label: "Unease", value: "unease" },
                { Icon: Waves, label: "Unclear", value: "unclear" },
                { Icon: Sun, label: "Aligned", value: "aligned" },
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
                    <option.Icon className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />
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
              { Icon: Circle, label: "Tight chest" },
              { Icon: Droplet, label: "Dropped stomach" },
              { Icon: Sparkles, label: "Expanding warmth" },
              { Icon: Cloud, label: "Numb" },
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
                  <option.Icon className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />
                  <span className="text-base text-foreground font-light">{option.label}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <Card className="bg-card border-border p-6 rounded-[1.25rem]">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground font-light">Add your own signal:</p>
              </div>
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
              { Icon: CheckCircle, label: "Yes (feels right)", value: "yes" },
              { Icon: XCircle, label: "No (something's off)", value: "no" },
              { Icon: Pause, label: "Pause (not sure yet)", value: "pause" },
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
                  <option.Icon className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />
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

import { useState } from "react";
import { Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";

const Home = () => {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);
  const [xp] = useState(45);

  const handleTap = () => {
    navigate("/tap-flow");
  };

  const handleVoiceStart = () => {
    setIsPressed(true);
  };

  const handleVoiceEnd = () => {
    setIsPressed(false);
    navigate("/voice-flow");
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col pb-20">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <div>
          <p className="text-sm text-muted-foreground">Total XP</p>
          <p className="text-2xl font-bold text-primary">{xp}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
          U
        </div>
      </div>

      {/* Main Gut Button */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-10">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-3xl font-bold text-foreground">
            What's your gut saying<br />right now?
          </h1>
        </div>

        {/* The Gut Button */}
        <div className="relative mb-16">
          <button
            onClick={handleTap}
            onTouchStart={handleVoiceStart}
            onTouchEnd={handleVoiceEnd}
            onMouseDown={handleVoiceStart}
            onMouseUp={handleVoiceEnd}
            onMouseLeave={() => setIsPressed(false)}
            className={`w-64 h-64 rounded-full bg-gradient-primary shadow-glow flex items-center justify-center transition-all duration-300 ${
              isPressed ? "scale-95" : "scale-100 hover:scale-105"
            } animate-pulse-glow`}
          >
            <Mic className="w-24 h-24 text-white" />
          </button>

          {/* Pulsing rings */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
          <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>

        {/* Instructions */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <p className="text-foreground font-medium">Tap to Log</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: "0.3s" }} />
            <p className="text-foreground font-medium">Hold to Speak</p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;

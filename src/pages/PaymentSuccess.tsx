import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Mark as paid in localStorage
    localStorage.setItem("hasPaid", "true");
    localStorage.setItem("hasCompletedOnboarding", "true");
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-700">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl font-cursive text-foreground mb-4">
            Welcome to Hara
          </h1>
          
          <p className="text-base text-muted-foreground/70 font-light mb-2">
            Your lifetime access is now active
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full mt-4">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm text-secondary font-light">Lifetime Member</span>
          </div>
        </div>

        <Button
          onClick={() => navigate("/home")}
          className="w-full rounded-[1rem] h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Start Your Journey
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccess;

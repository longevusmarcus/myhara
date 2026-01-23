import { useState } from "react";
import { X, Check, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Paywall = ({ open, onOpenChange }: PaywallProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    "Unlimited gut check-ins",
    "AI-powered gut coach",
    "Pattern recognition insights",
    "Voice & tap journaling",
    "Personalized intuition training",
    "Lifetime access",
  ];

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: {},
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-0 bg-background p-0 gap-0 rounded-[1.25rem] overflow-hidden mx-4">
        <DialogTitle className="sr-only">Unlock Full Access</DialogTitle>
        
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-3 top-3 z-10 p-1.5 rounded-full text-muted-foreground/40 hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 py-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 mb-6">
            <Sparkles className="w-3 h-3 text-muted-foreground/50" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50 font-light">
              Early Founders
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl text-foreground mb-0.5 font-light">
            Unlock Your
          </h2>
          <h2 className="text-2xl font-cursive text-foreground/70 italic mb-3">
            Full Gut Potential
          </h2>

          {/* Subtitle */}
          <p className="text-xs text-muted-foreground/50 font-light leading-relaxed mb-6">
            Join the founding members trusting their gut<br />
            with science-backed intuition training
          </p>

          {/* Price */}
          <div className="mb-1">
            <span className="text-base text-muted-foreground/30 line-through mr-2">$29</span>
            <span className="text-4xl text-foreground font-light">$4.99</span>
            <span className="text-xs text-muted-foreground/50 ml-1">/lifetime</span>
          </div>
          <p className="text-[10px] text-muted-foreground/40 mb-6">
            One-time payment, forever access
          </p>

          {/* Features - 2 columns for compact layout */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-left mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="w-3 h-3 text-muted-foreground/40 flex-shrink-0" />
                <span className="text-[11px] text-muted-foreground/60 font-light">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full rounded-full h-12 bg-foreground hover:bg-foreground/90 text-background text-sm font-medium"
          >
            {isLoading ? "Processing..." : "Start Your Journey"}
          </Button>

          {/* Footer text */}
          <p className="text-[10px] text-muted-foreground/30 mt-3 font-light">
            Secure payment via Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Paywall;

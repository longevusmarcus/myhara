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
    "Lifetime access, no subscriptions",
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
      <DialogContent className="max-w-md border-0 bg-background p-0 gap-0 rounded-[1.5rem] overflow-hidden">
        <DialogTitle className="sr-only">Unlock Full Access</DialogTitle>
        
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 p-2 rounded-full text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pt-12 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-muted-foreground/60" />
            <span className="text-xs tracking-[0.25em] uppercase text-muted-foreground/60 font-light">
              Early Founders
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl text-foreground mb-1">
            Unlock Your
          </h2>
          <h2 className="text-3xl font-cursive text-foreground/80 italic mb-4">
            Full Gut Potential
          </h2>

          {/* Subtitle */}
          <p className="text-muted-foreground/60 font-light mb-8">
            Join the founding members trusting their gut<br />
            with science-backed intuition training
          </p>

          {/* Price */}
          <div className="mb-2">
            <span className="text-2xl text-muted-foreground/40 line-through mr-3">$29</span>
            <span className="text-5xl text-foreground font-light">$4.99</span>
            <span className="text-muted-foreground/60 ml-2">/lifetime</span>
          </div>
          <p className="text-sm text-muted-foreground/50 mb-8">
            One-time payment, forever access
          </p>

          {/* Features */}
          <div className="space-y-3 text-left mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-muted-foreground/60 flex-shrink-0" />
                <span className="text-muted-foreground/80 font-light">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full rounded-full h-14 bg-foreground hover:bg-foreground/90 text-background text-base font-medium"
          >
            {isLoading ? "Processing..." : "Start Your Journey"}
          </Button>

          {/* Footer text */}
          <p className="text-xs text-muted-foreground/40 mt-4 font-light">
            Secure payment via Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Paywall;

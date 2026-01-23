import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
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
      <DialogContent className="w-full h-full max-w-none max-h-none m-0 border-0 bg-background p-0 gap-0 rounded-none data-[state=open]:slide-in-from-bottom-0 data-[state=open]:fade-in-0 [&>button]:right-5 [&>button]:top-5 [&>button]:text-muted-foreground/40">
        <DialogTitle className="sr-only">Unlock Full Access</DialogTitle>

        <div className="flex flex-col justify-center items-center min-h-screen px-8 py-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-10">
            <Sparkles className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground/50 font-light">
              Early Founders
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl text-foreground mb-1 font-light text-center">
            Unlock Your
          </h2>
          <h2 className="text-3xl font-cursive text-foreground/70 italic mb-4 text-center">
            Full Gut Potential
          </h2>

          {/* Subtitle */}
          <p className="text-sm text-muted-foreground/50 font-light leading-relaxed mb-10 text-center max-w-xs">
            Join the founding members trusting their gut with science-backed intuition training
          </p>

          {/* Price */}
          <div className="mb-1 text-center">
            <span className="text-lg text-muted-foreground/30 line-through mr-2">$29</span>
            <span className="text-5xl text-foreground font-light">$4.99</span>
            <span className="text-sm text-muted-foreground/50 ml-1">/lifetime</span>
          </div>
          <p className="text-xs text-muted-foreground/40 mb-10">
            One-time payment, forever access
          </p>

          {/* Features */}
          <div className="space-y-3 mb-12 w-full max-w-xs">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                <span className="text-sm text-muted-foreground/70 font-light">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full max-w-xs rounded-full h-14 bg-foreground hover:bg-foreground/90 text-background text-base font-medium"
          >
            {isLoading ? "Processing..." : "Start Your Journey"}
          </Button>

          {/* Footer text */}
          <p className="text-[11px] text-muted-foreground/30 mt-5 font-light">
            Secure payment via Stripe
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Paywall;

import { useState } from "react";
import { X, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";

interface PaywallProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Paywall = ({ open, onOpenChange }: PaywallProps) => {
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-background/95 backdrop-blur-sm" />
      <DialogContent className="max-w-md w-full bg-background border-none shadow-none p-6 sm:p-8 [&>button]:hidden">
        {/* Close button - only show if dismissible */}
        {onOpenChange && (
          <button 
            onClick={() => onOpenChange(false)} 
            className="absolute top-4 right-4 p-2 text-muted-foreground/50 hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

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
      </DialogContent>
    </Dialog>
  );
};

export default Paywall;

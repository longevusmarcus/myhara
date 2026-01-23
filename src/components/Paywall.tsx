import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
      <DialogContent className="w-full h-full max-w-none max-h-none m-0 border-0 bg-background p-0 gap-0 rounded-none [&>button]:right-5 [&>button]:top-5 [&>button]:text-muted-foreground/40">
        <DialogTitle className="sr-only">Unlock Full Access</DialogTitle>

        <AnimatePresence>
          {open && (
            <motion.div
              className="flex flex-col justify-center items-center min-h-screen px-8 py-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Sparkles className="w-3.5 h-3.5 text-muted-foreground/50" />
                <span className="text-[11px] tracking-[0.25em] uppercase text-muted-foreground/50 font-light">
                  Early Founders
                </span>
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl text-foreground mb-1 font-light text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
              >
                Unlock Your
              </motion.h2>
              <motion.h2
                className="text-3xl font-cursive text-foreground/70 italic mb-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Full Gut Potential
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                className="text-sm text-muted-foreground/50 font-light leading-relaxed mb-10 text-center max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                Join the founding members trusting their gut with science-backed intuition training
              </motion.p>

              {/* Price */}
              <motion.div
                className="mb-1 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <span className="text-lg text-muted-foreground/30 line-through mr-2">$29</span>
                <span className="text-5xl text-foreground font-light">$4.99</span>
                <span className="text-sm text-muted-foreground/50 ml-1">/lifetime</span>
              </motion.div>
              <motion.p
                className="text-xs text-muted-foreground/40 mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                One-time payment, forever access
              </motion.p>

              {/* Features */}
              <motion.div
                className="space-y-3 mb-12 w-full max-w-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05, duration: 0.4 }}
                  >
                    <Check className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground/70 font-light">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Button */}
              <motion.div
                className="w-full max-w-xs"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Button
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="w-full rounded-full h-14 bg-foreground hover:bg-foreground/90 text-background text-base font-medium"
                >
                  {isLoading ? "Processing..." : "Start Your Journey"}
                </Button>
              </motion.div>

              {/* Footer text */}
              <motion.p
                className="text-[11px] text-muted-foreground/30 mt-5 font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                Secure payment via Stripe
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default Paywall;

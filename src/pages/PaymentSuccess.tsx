import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [recorded, setRecorded] = useState(false);

  useEffect(() => {
    const recordPayment = async () => {
      // Mark as paid in localStorage immediately
      localStorage.setItem("hasPaid", "true");

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Try to insert payment record (webhook will also do this, but this is faster)
          await (supabase.from("user_payments" as any) as any).upsert({
            user_id: user.id,
            amount: 499,
            currency: "usd",
            status: "completed",
            payment_type: "lifetime"
          }, {
            onConflict: "user_id,payment_type"
          });
        }
      } catch (error) {
        console.error("Error recording payment:", error);
        // Payment still valid via localStorage
      }
      
      setRecorded(true);
    };

    recordPayment();
  }, []);

  useEffect(() => {
    if (recorded) {
      // Auto-redirect after recording
      const timer = setTimeout(() => {
        navigate("/home");
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [recorded, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-light text-foreground mb-4"
        >
          Welcome
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-muted-foreground/60 font-light"
        >
          Your journey begins now
        </motion.p>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-12"
        >
          <p className="text-sm text-muted-foreground/40 font-light">
            Redirecting...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;

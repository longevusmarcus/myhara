import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { ScrollToTop } from "./components/ScrollToTop";
import Onboarding from "./components/Onboarding";
import MobileOnly from "./components/MobileOnly";
import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import Insights from "./pages/Insights";
import GutMap from "./pages/GutMap";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Achievements from "./pages/Achievements";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    setHasCompletedOnboarding(completed === "true");

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("onboarding_completed", "true");
    setHasCompletedOnboarding(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <MobileOnly>
          <BrowserRouter>
          <ScrollToTop />
          {!hasCompletedOnboarding ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : loading ? (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-muted-foreground font-light">Loading...</p>
            </div>
          ) : !session ? (
            <Auth />
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<Home />} />
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/map" element={<GutMap />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </BrowserRouter>
        </MobileOnly>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

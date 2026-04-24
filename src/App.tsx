import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { ScrollToTop } from "./components/ScrollToTop";
import { MsxBootProvider, useMsxBoot } from "./components/MsxBootProvider";
import MsxOpeningScreen from "./components/MsxOpeningScreen";
import MsxLaunchErrorScreen from "./components/MsxLaunchErrorScreen";
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
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookie from "./pages/Cookie";
import About from "./pages/About";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppShell = () => {
  const msx = useMsxBoot();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const completed = localStorage.getItem(`onboarding_completed_${session.user.id}`);
        setHasCompletedOnboarding(completed === "true");
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const completed = localStorage.getItem(`onboarding_completed_${session.user.id}`);
        setHasCompletedOnboarding(completed === "true");
      } else {
        setHasCompletedOnboarding(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleOnboardingComplete = () => {
    if (session?.user) {
      localStorage.setItem(`onboarding_completed_${session.user.id}`, "true");
      setHasCompletedOnboarding(true);
    }
  };

  // MSX boot gate — short-circuits the normal auth flow while opening from the shell.
  if (msx.status === "booting") {
    return <MsxOpeningScreen />;
  }
  if (msx.status === "failed") {
    return <MsxLaunchErrorScreen stage={msx.failStage} detail={msx.failDetail} />;
  }

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/about" element={<About />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/" element={<Navigate to={msx.status === "ready" ? "/home" : "/about"} replace />} />

      <Route path="/*" element={
        <MobileOnly>
          {loading ? (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <p className="text-muted-foreground font-light">Loading...</p>
            </div>
          ) : !session ? (
            <Routes>
              {/* Inside MSX, never show the login form — hard redirect home (boot will hydrate). */}
              <Route path="auth" element={msx.inMsx ? <Navigate to="/home" replace /> : <Auth />} />
              <Route path="terms" element={<Terms />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="cookie" element={<Cookie />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="*" element={<Navigate to={msx.inMsx ? "/home" : "/about"} replace />} />
            </Routes>
          ) : !hasCompletedOnboarding ? (
            <Onboarding onComplete={handleOnboardingComplete} />
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="auth" element={<Navigate to="/home" replace />} />
              <Route path="home" element={<Home />} />
              <Route path="check-in" element={<CheckIn />} />
              <Route path="insights" element={<Insights />} />
              <Route path="map" element={<GutMap />} />
              <Route path="gut" element={<GutMap />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="help" element={<Help />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </MobileOnly>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <MsxBootProvider>
          <AppShell />
        </MsxBootProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

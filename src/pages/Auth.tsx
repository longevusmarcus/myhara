import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import VoiceBubbleLogo from "@/components/VoiceBubbleLogo";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/home");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/home");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've successfully signed in.",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Welcome to Hara.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-accent/20 animate-pulse" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-primary/30 animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-32 left-1/4 w-2.5 h-2.5 rounded-full bg-secondary/25 animate-pulse" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
        <div className="absolute top-1/3 right-10 w-2 h-2 rounded-full bg-accent/15 animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '5s' }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Voice bubble logo and branding */}
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center animate-in fade-in zoom-in duration-700">
            <VoiceBubbleLogo size="md" animated={true} />
          </div>
          <h1 className="text-4xl font-cursive text-foreground tracking-tight mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
            Hara
          </h1>
          <p className="text-lg text-foreground font-light animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '300ms' }}>
            Trust your gut.
          </p>
          <p className="text-base text-muted-foreground font-light animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
            Make better decisions with it.
          </p>
        </div>

        {/* Auth form card */}
        <div className="backdrop-blur-xl bg-card/40 border border-border/30 rounded-[1.5rem] p-8 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: '400ms' }}>
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="bg-background/60 border-border/40 rounded-[1rem] h-12 text-base placeholder:text-muted-foreground/60 focus:border-primary/50 transition-all"
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="bg-background/60 border-border/40 rounded-[1rem] h-12 text-base placeholder:text-muted-foreground/60 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>
            )}
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/60 border-border/40 rounded-[1rem] h-12 text-base placeholder:text-muted-foreground/60 focus:border-primary/50 transition-all"
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-background/60 border-border/40 rounded-[1rem] h-12 text-base placeholder:text-muted-foreground/60 focus:border-primary/50 transition-all"
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground/70 mt-2 ml-1">
                  8+ characters, 1 uppercase, 1 number recommended
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-[1rem] h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
            >
              {loading ? "Loading..." : isLogin ? "Sign in" : "Get started"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground/80 font-light hover:text-foreground transition-colors"
            >
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span className="text-primary font-medium">
                {isLogin ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>
        </div>

        {/* Footer text */}
        {!isLogin && (
          <p className="text-center text-xs text-muted-foreground/60 mt-6 animate-in fade-in duration-700" style={{ animationDelay: '600ms' }}>
            By continuing, you agree to Hara's Terms of Service and Privacy Policy
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
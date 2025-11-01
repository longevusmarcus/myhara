import { useEffect, useState } from "react";
import { Smartphone } from "lucide-react";
import haraMascot from "@/assets/hara-mascot.png";

const MobileOnly = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
      const isMobileDevice = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isSmallScreen = window.innerWidth <= 768;
      
      setIsMobile(isMobileDevice || isSmallScreen);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="mb-8 flex justify-center">
            <img 
              src={haraMascot} 
              alt="Hara mascot" 
              className="w-32 h-32 object-contain animate-pulse"
            />
          </div>
          
          <div className="backdrop-blur-xl bg-card/40 border border-border/30 rounded-[1.5rem] p-8 shadow-2xl">
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-primary/10">
                <Smartphone className="w-12 h-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-3xl font-cursive text-foreground mb-4">
              Hara
            </h1>
            
            <p className="text-lg text-foreground mb-3">
              Mobile experience only
            </p>
            
            <p className="text-sm text-muted-foreground font-light leading-relaxed">
              Hara is designed for your mobile device. Please visit this app on your smartphone for the best mindful experience.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileOnly;

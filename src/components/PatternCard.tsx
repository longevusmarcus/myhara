import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Lightbulb, Brain, List, HelpCircle } from "lucide-react";
import { useState } from "react";

interface PatternCardProps {
  title: string;
  observation: string;
  intuitionGuide: string;
  relatedEntries: string[];
  questions: string[];
  icon?: React.ReactNode;
  accentColor?: string;
}

export const PatternCard = ({
  title,
  observation,
  intuitionGuide,
  relatedEntries,
  questions,
  icon,
  accentColor = "primary"
}: PatternCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
  };

  const bgClass = accentColor === "accent" ? "bg-accent/10" : "bg-primary/10";
  const textClass = accentColor === "accent" ? "text-accent" : "text-primary";

  return (
    <Card className="bg-card border-border rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-start gap-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className={`w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
          {icon || <Brain className={`w-5 h-5 ${textClass}`} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-medium text-foreground leading-snug">
              {title}
            </h3>
            <div className="transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>
              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-light mt-1.5 line-clamp-2">
            {observation}
          </p>
        </div>
      </button>

      {/* Expanded Content */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 space-y-5 border-t border-border/40 pt-5">
          {/* Full Observation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-primary" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Observation
              </p>
            </div>
            <p className="text-sm text-foreground/90 font-light leading-relaxed pl-3">
              {observation}
            </p>
          </div>

          {/* Intuition Guide */}
          {intuitionGuide && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-accent" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Intuition Guide
                </p>
              </div>
              <div className="bg-accent/5 border border-accent/10 rounded-xl p-3.5">
                <p className="text-sm text-foreground/90 font-light leading-relaxed">
                  {intuitionGuide}
                </p>
              </div>
            </div>
          )}

          {/* Related Entries */}
          {relatedEntries && relatedEntries.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <List className="w-3.5 h-3.5 text-primary/70" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Related Entries ({relatedEntries.length})
                </p>
              </div>
              <div className="space-y-1.5 pl-1">
                {relatedEntries.slice(0, 3).map((entry, idx) => (
                  <div key={idx} className="flex gap-2 text-xs text-muted-foreground">
                    <span className="text-primary/50 mt-0.5">•</span>
                    <p className="font-light leading-relaxed line-clamp-2 flex-1">{entry}</p>
                  </div>
                ))}
                {relatedEntries.length > 3 && (
                  <p className="text-xs text-muted-foreground/70 font-light pl-3 pt-1">
                    +{relatedEntries.length - 3} more
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Questions for Reflection */}
          {questions && questions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-primary/70" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Reflection Questions
                </p>
              </div>
              <div className="space-y-2 pl-1">
                {questions.map((question, idx) => (
                  <div key={idx} className="flex gap-2 text-sm text-foreground/90">
                    <span className="text-accent font-medium flex-shrink-0">{idx + 1}.</span>
                    <p className="font-light leading-relaxed flex-1">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

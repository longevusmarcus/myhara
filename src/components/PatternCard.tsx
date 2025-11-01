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

  return (
    <Card className="bg-card border-border rounded-2xl overflow-hidden transition-all hover:shadow-lg">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 flex items-start gap-4 text-left hover:bg-card/80 transition-colors"
      >
        <div className={`w-12 h-12 rounded-xl bg-${accentColor}/10 flex items-center justify-center flex-shrink-0`}>
          {icon || <Brain className={`w-6 h-6 text-${accentColor}`} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-medium text-foreground leading-tight">
              {title}
            </h3>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            )}
          </div>
          <p className="text-sm text-muted-foreground font-light mt-2 line-clamp-2">
            {observation}
          </p>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-6 border-t border-border/50 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Full Observation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <p className="text-xs font-medium text-foreground uppercase tracking-wide">
                Observation
              </p>
            </div>
            <p className="text-base text-foreground/80 font-light leading-relaxed pl-3.5">
              {observation}
            </p>
          </div>

          {/* Intuition Guide */}
          {intuitionGuide && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                <p className="text-xs font-medium text-foreground uppercase tracking-wide">
                  Intuition Guide
                </p>
              </div>
              <div className="bg-accent/5 rounded-xl p-4">
                <p className="text-sm text-foreground/90 font-light leading-relaxed">
                  {intuitionGuide}
                </p>
              </div>
            </div>
          )}

          {/* Related Entries */}
          {relatedEntries.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-primary" />
                <p className="text-xs font-medium text-foreground uppercase tracking-wide">
                  Related Entries ({relatedEntries.length})
                </p>
              </div>
              <div className="space-y-2">
                {relatedEntries.slice(0, 3).map((entry, idx) => (
                  <div key={idx} className="flex gap-2 text-sm text-muted-foreground pl-1">
                    <span className="text-primary/60">•</span>
                    <p className="font-light line-clamp-2 flex-1">{entry}</p>
                  </div>
                ))}
                {relatedEntries.length > 3 && (
                  <p className="text-xs text-muted-foreground font-light pl-3">
                    +{relatedEntries.length - 3} more entries
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Questions for Reflection */}
          {questions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" />
                <p className="text-xs font-medium text-foreground uppercase tracking-wide">
                  Questions for Reflection
                </p>
              </div>
              <div className="space-y-2">
                {questions.map((question, idx) => (
                  <div key={idx} className="flex gap-2 text-sm text-foreground/80 pl-1">
                    <span className="text-accent font-medium">{idx + 1}.</span>
                    <p className="font-light flex-1">{question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

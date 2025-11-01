import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AICoachProps {
  type: "daily" | "insight";
  initialPrompt?: string;
}

export const AICoach = ({ type, initialPrompt }: AICoachProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      sendMessage(initialPrompt, true);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string, isInitial = false) => {
    if (!text.trim() && !isInitial) return;

    const userMessage: Message = { role: "user", content: text };
    const newMessages = isInitial ? [userMessage] : [...messages, userMessage];
    
    if (!isInitial) {
      setMessages(newMessages);
      setInput("");
    }
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gut-coach`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: newMessages,
            type,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (let line of lines) {
          line = line.trim();
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages([...newMessages, { role: "assistant", content: assistantMessage }]);
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get AI response",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {messages.length === 0 && !isLoading && (
          <Card className="bg-card/50 border-border p-6 rounded-[1.25rem]">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-1" />
              <div className="space-y-2">
                <p className="text-base text-foreground font-light">
                  {type === "daily" 
                    ? "Hi! I'm here to help you check in with your gut. How are you feeling right now?"
                    : "I can help you understand your intuition patterns and make sense of your journey."
                  }
                </p>
              </div>
            </div>
          </Card>
        )}

        {messages.map((msg, idx) => (
          <Card
            key={idx}
            className={`p-4 rounded-[1.25rem] ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground ml-8"
                : "bg-card border-border mr-8"
            }`}
          >
            <p className="text-sm font-light whitespace-pre-wrap">{msg.content}</p>
          </Card>
        ))}

        {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
          <Card className="bg-card border-border p-4 rounded-[1.25rem] mr-8">
            <div className="flex items-center gap-2">
              <div className="animate-pulse flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
              </div>
            </div>
          </Card>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder="Share what's on your mind..."
          className="resize-none bg-card border-border rounded-[1.25rem]"
          rows={2}
        />
        <Button
          onClick={() => sendMessage(input)}
          disabled={isLoading || !input.trim()}
          size="icon"
          className="rounded-[1rem] h-auto px-4"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
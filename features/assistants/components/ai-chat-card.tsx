import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAskAI } from "../api/use-ask-ai";

type AIChatCardProps = {
  text: string;
};

export function AIChatCard({ text }: AIChatCardProps) {
  const { chat, isPending } = useAskAI();

  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState<string>("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    chat(
      { json: { messages: [...messages, userMessage] } },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            { role: data.role, content: data.content },
          ]);
        },
        onError: (error) => {
          console.error("Error in AI response:", error);
        },
      },
    );
  };

  return (
    <Card className="w-full max-w-[450px] shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <span>Book AI Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          {messages.map((m, index) => (
            <div key={index} className="flex gap-3 mb-4">
              <Avatar>
                <AvatarFallback>
                  {m.role === "user" ? "U" : "AI"}
                </AvatarFallback>
                <AvatarImage
                  src={
                    m.role === "user"
                      ? "/placeholder.svg?height=40&width=40"
                      : "/placeholder.svg?height=40&width=40"
                  }
                />
              </Avatar>
              <div
                className={`rounded-lg p-2 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the book..."
            disabled={isPending}
          />
          <Button type="submit" size="icon" disabled={isPending}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}

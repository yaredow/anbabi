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
import { useGetBook } from "@/features/books/api/use-get-book";
import { useBookId } from "@/features/books/hooks/use-book-id";

type AIChatCardProps = {
  text: string;
};

export function AIChatCard({ text }: AIChatCardProps) {
  const bookId = useBookId();
  const { chat, isPending } = useAskAI();
  const { book } = useGetBook({ bookId });

  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([{ role: "user", content: text }]);
  const [input, setInput] = useState<string>("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    chat(
      {
        json: {
          messages: [...messages, userMessage],
          title: book?.title!,
          author: book?.author!,
        },
      },
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
    <Card className="w-full  shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"></CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className=" w-full pr-4 overflow-y-auto">
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

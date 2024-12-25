import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useBookId } from "@/features/books/hooks/use-book-id";
import { useAskAI } from "../api/use-ask-ai";
import { useGetBook } from "@/features/books/api/use-get-book";
import { Role } from "../types";
import ReactMarkdown from "react-markdown";

interface AIChatCardProps {
  text: string;
}

interface Message {
  role: Role;
  content: string;
}

export function AIChatCard({ text }: AIChatCardProps) {
  const bookId = useBookId();
  const { chat, isPending } = useAskAI();
  const { book } = useGetBook({ bookId });

  const [messages, setMessages] = useState<Message[]>([
    { role: Role.User, content: text },
  ]);
  const [input, setInput] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sendChatMessage = async (message: string) => {
    const userMessage: Message = { role: Role.User, content: message };
    setIsTyping(true);

    chat(
      {
        json: {
          messages: [...messages, userMessage],
          title: book?.title ?? "Unknown Book",
          author: book?.author ?? "Unknown Author",
        },
      },
      {
        onSuccess: (data) => {
          setIsTyping(false);
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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendChatMessage(input);
    setInput("");
  };

  useEffect(() => {
    if (text) {
      sendChatMessage(text);
    }
  }, [text]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-grow pr-4 mb-4" ref={scrollAreaRef}>
        <div className="space-y-4 p-4">
          {messages.map((m, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                m.role === Role.User ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Avatar */}
              <Avatar>
                <AvatarFallback>
                  {m.role === Role.User ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </AvatarFallback>
                <AvatarImage
                  src={
                    m.role === Role.User ? "/user-avatar.png" : "/ai-avatar.png"
                  }
                  alt={m.role === Role.User ? "User Avatar" : "AI Avatar"}
                />
              </Avatar>

              {/* Message Bubble */}
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  m.role === Role.User
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3 flex-row-reverse">
              <Avatar>
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
                <AvatarImage src="/ai-avatar.png" alt="AI Avatar" />
              </Avatar>
              <div className="rounded-lg p-3 bg-secondary text-secondary-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Section */}
      <div className="p-4 border-t">
        <form
          onSubmit={handleSendMessage}
          className="flex w-full items-center space-x-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the book..."
            disabled={isPending || isTyping}
            aria-label="Chat input"
          />
          <Button type="submit" size="icon" disabled={isPending || isTyping}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

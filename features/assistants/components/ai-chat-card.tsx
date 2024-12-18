import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AIChatCardProps {
  word: string;
  onClose: () => void;
}

export const AIChatCard: React.FC<AIChatCardProps> = ({ word, onClose }) => {
  const [messages, setMessages] = useState([
    { role: "system", content: `Let's discuss the word or phrase: "${word}"` },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }]);
      // Here you would typically send the message to an AI service and get a response
      // For this example, we'll just echo the user's message
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `You said: ${input}` },
        ]);
      }, 500);
      setInput("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          AI Chat
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 overflow-y-auto mb-4 border rounded p-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.role === "user" ? "text-right" : ""}`}
            >
              <span
                className={`inline-block p-2 rounded ${msg.role === "user" ? "bg-blue-100" : "bg-gray-100"}`}
              >
                {msg.content}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardContent>
    </Card>
  );
};

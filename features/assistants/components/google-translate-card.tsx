import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface TranslateCardProps {
  word: string;
  onClose: () => void;
}

export const TranslateCard: React.FC<TranslateCardProps> = ({
  word,
  onClose,
}) => {
  const [fromLang, setFromLang] = useState("en");
  const [toLang, setToLang] = useState("es");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Translate
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Select value={fromLang} onValueChange={setFromLang}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
          <Select value={toLang} onValueChange={setToLang}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Input value={word} readOnly />
        </div>
        <div>
          <Input value="Translated text would appear here" readOnly />
        </div>
      </CardContent>
    </Card>
  );
};

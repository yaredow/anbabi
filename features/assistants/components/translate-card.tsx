import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "../constants";
import { useTranslateText } from "../api/use-translate-text";
import { detectLanguage } from "@/lib/utils";

type TranslateCardProps = {
  selectedText: string;
  onClose: () => void;
};

export default function TranslateCard({ selectedText }: TranslateCardProps) {
  const detectedLanguage = detectLanguage(selectedText);
  const [fromLang, setFromLang] = useState<string>(detectedLanguage);
  const [toLang, setToLang] = useState<string>("am");
  const {
    translatedText,
    isPending: isTranslationPending,
    refetch,
  } = useTranslateText({
    text: selectedText,
    sourceLang: fromLang,
    targetLang: toLang,
  });

  console.log({ detectedLanguage });

  useEffect(() => {
    if (selectedText) {
      refetch();
    }
  }, [fromLang, toLang]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Translate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-md min-h-[100px]">
            {isTranslationPending ? (
              <p>Translating...</p>
            ) : (
              <p>{translatedText}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <Select
            value={fromLang}
            onValueChange={(value) => setFromLang(value)}
          >
            <SelectTrigger id="from-lang">
              <SelectValue placeholder={detectedLanguage || "Detecting..."} />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/2">
          <Select value={toLang} onValueChange={setToLang}>
            <SelectTrigger id="to-lang">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  );
}

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { languages } from "../constants";
import { useTranslateText } from "../api/use-translate-text";
import { useDetectLanguages } from "../api/use-detect-langugaes";

type TranslateCardProps = {
  selectedText: string;
  onClose: () => void;
};

export default function TranslateCard({ selectedText }: TranslateCardProps) {
  const [fromLang, setFromLang] = useState<string>("");
  const [toLang, setToLang] = useState<string>("am");

  const { detectedLanguage, isPending: isDetectionPending } =
    useDetectLanguages({
      text: selectedText,
    });

  const {
    translatedText,
    isPending: isTranslationPending,
    refetch,
  } = useTranslateText({
    text: selectedText,
    sourceLang: fromLang,
    targetLang: toLang,
  });

  useEffect(() => {
    if (detectedLanguage && !isDetectionPending) {
      setFromLang(detectedLanguage);
    }
  }, [detectedLanguage, isDetectionPending]);

  useEffect(() => {
    if (fromLang && toLang) {
      refetch();
    }
  }, [fromLang, toLang, refetch]);

  return (
    <div className="w-full h-full flex flex-col bg-neutral-50 overflow-hidden">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-md min-h-[100px]">
            {isTranslationPending ? (
              <p className="text-muted-foreground">Translating...</p>
            ) : (
              <p>{translatedText}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 border-t flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-1/2">
          <Select
            value={fromLang}
            onValueChange={(value) => setFromLang(value)}
          >
            <SelectTrigger id="from-lang">
              <SelectValue
                placeholder={
                  !isDetectionPending ? detectedLanguage : "Detecting..."
                }
              />
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
      </div>
    </div>
  );
}

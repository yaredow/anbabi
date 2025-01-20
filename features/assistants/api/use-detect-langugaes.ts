import { useQuery } from "@tanstack/react-query";
import { LanguageDetectionResponse } from "../types";
import { assistatntKeys } from "@/lib/queryKeys";

type UseDetectLanguagesProps = {
  text: string;
};

const API_KEY = process.env.NEXT_PUBLIC_DETECT_LANGUAGE_API_KEY;

export const useDetectLanguages = ({ text }: UseDetectLanguagesProps) => {
  const { data, isPending } = useQuery<LanguageDetectionResponse, Error>({
    queryKey: assistatntKeys.detetction(text),
    queryFn: async () => {
      const response = await fetch("https://ws.detectlanguage.com/0.2/detect", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    },
  });

  const detectedLanguage = data?.data?.detections?.[0]?.language || "";

  return { detectedLanguage, isPending };
};

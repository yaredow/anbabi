import { useQuery } from "@tanstack/react-query";

type UseDetectLanguagesProps = {
  text: string;
};

export const useDetectLanguages = ({ text }: UseDetectLanguagesProps) => {
  const { data: detectedLanguage, isPending } = useQuery<string, Error>({
    queryKey: ["detected-languages", text],
    queryFn: async () => {
      const response = await fetch("https://libretranslate.com/detect", {
        method: "POST",
        headers: {
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
      return data[0].language;
    },
  });
  return { detectedLanguage, isPending };
};

import { assistatntKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

type UseTranslateTextProps = {
  text: string;
  sourceLang: string;
  targetLang: string;
};

export const useTranslateText = ({
  targetLang,
  sourceLang,
  text,
}: UseTranslateTextProps) => {
  const {
    data: translatedText,
    isPending,
    refetch,
  } = useQuery<string, Error>({
    queryKey: assistatntKeys.translation(text, targetLang, sourceLang),
    queryFn: async () => {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text,
        )}&langpair=${sourceLang.toUpperCase()}|${targetLang.toUpperCase()}`,
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.responseData.translatedText;
    },
    enabled: !!text && !!sourceLang && !!targetLang,
  });

  return { translatedText, isPending, refetch };
};

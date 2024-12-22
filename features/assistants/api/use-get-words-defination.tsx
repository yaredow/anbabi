import { useQuery } from "@tanstack/react-query";
import { DictionaryApiResponse } from "../types";

type UseGetWordDefinationProps = {
  word: string;
};

export const useGetWordDefination = ({ word }: UseGetWordDefinationProps) => {
  const { data: defination, isPending } = useQuery<
    DictionaryApiResponse,
    Error
  >({
    queryKey: ["defination", word],
    queryFn: async () => {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );

      if (!response.ok) {
        throw new Error("Something happened while getting the defination");
      }

      const data = await response.json();
      return data[0];
    },
    enabled: !!word,
  });
  return { defination, isPending };
};

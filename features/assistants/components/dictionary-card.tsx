import React, { useState } from "react";
import { Loader2, Play } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Meaning } from "../types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetWordDefination } from "../api/use-get-words-defination";

type DictionaryCardProps = {
  word: string;
  onClose: () => void;
};

type WordMeaningProps = {
  meaning: Meaning;
};

const WordMeaning = ({ meaning }: WordMeaningProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold capitalize">
        {meaning.partOfSpeech}
      </h3>
      <ol className="list-decimal list-inside space-y-2 mt-2">
        {meaning.definitions.map((def: any, index: number) => (
          <li key={index} className="text-sm">
            <span>{def.definition}</span>
            {def.example && (
              <p className="text-muted-foreground italic mt-1">
                {def.example}"
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default function DictionaryCard({ word, onClose }: DictionaryCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { definition, isPending } = useGetWordDefination({ word });

  const playAudio = () => {
    const audioUrl = definition?.phonetics?.find((p) => p.audio)?.audio;
    if (audioUrl) {
      setIsPlaying(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlaying(false);
      audio.play();
    }
  };

  if (isPending) {
    return (
      <Loader2 className="flex items-center justify-center mx-auto animate-spin h-[85%]" />
    );
  }

  if (!definition) {
    return (
      <div className="w-full h-full bg-neutral-50 flex items-center justify-center">
        <p className="text-center text-muted-foreground">
          No definition found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full -mt-3 h-full bg-background overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{definition.word}</h2>
            <p className="text-sm text-muted-foreground">
              {definition.phonetic}
            </p>
          </div>
          {definition.phonetics?.some((p) => p.audio) && (
            <Button
              variant="outline"
              size="icon"
              onClick={playAudio}
              disabled={isPlaying}
            >
              <Play className="h-4 w-4" />
              <span className="sr-only">
                {isPlaying ? "Playing pronunciation" : "Play pronunciation"}
              </span>
            </Button>
          )}
        </div>
      </div>
      <ScrollArea className="flex-grow p-4">
        {definition.origin && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Origin
            </h3>
            <p className="text-sm">{definition.origin}</p>
          </div>
        )}
        <div className="space-y-4">
          {definition.meanings?.map((meaning: Meaning, index: number) => (
            <WordMeaning key={index} meaning={meaning} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

import React from "react";
import { Loader2, Play } from "lucide-react";

import { RenditionRef } from "@/features/books/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DottedSeparator from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";

import { useGetWordDefination } from "../api/use-get-words-defination";
import { Meaning } from "../types";

type DictionaryCardProps = {
  word: string;
  onClose: () => void;
  renditionRef: RenditionRef | undefined;
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

export default function DictionaryCard({
  word,
  onClose,
  renditionRef,
}: DictionaryCardProps) {
  const { defination, isPending } = useGetWordDefination({ word });

  const playAudio = () => {
    const audioUrl = defination?.phonetics?.find((p) => p.audio)?.audio;
    console.log({ audioUrl });
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  if (isPending) {
    return (
      <Loader2 className="flex items-center justify-center mx-auto animate-spin h-[85%]" />
    );
  }

  if (!defination) {
    return (
      <Card className="w-full rounded-none border-none bg-neutral-50 max-w-2xl mx-auto">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No definition found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full max-w-2xl mx-auto bg-neutral-50 overflow-y-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">
              {defination.word}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {defination.phonetic}
            </p>
          </div>
          {defination.phonetics?.some((p) => p.audio) && (
            <Button variant="outline" size="icon" onClick={playAudio}>
              <Play className="h-4 w-4" />
              <span className="sr-only">Play pronunciation</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-full">
        {defination.origin && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Origin
            </h3>
            <p className="text-sm">{defination.origin}</p>
          </div>
        )}
        <DottedSeparator className="my-2" />
        <div className="space-y-4">
          {defination.meanings?.map((meaning: any, index: number) => (
            <WordMeaning key={index} meaning={meaning} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

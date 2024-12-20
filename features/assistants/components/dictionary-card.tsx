import React from "react";
import { Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DottedSeparator from "@/components/dotted-separator";

interface DictionaryCardProps {
  data: any;
}

interface WordMeaningProps {
  meaning: any; // You might want to create a more specific type based on the API response
}

const WordMeaning: React.FC<WordMeaningProps> = ({ meaning }) => {
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
                "{def.example}"
              </p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

const DictionaryCard: React.FC<DictionaryCardProps> = ({ data }) => {
  const word = data[0];

  const playAudio = () => {
    const audio = new Audio(word.phonetics[0]?.audio);
    audio.play();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">{word.word}</CardTitle>
            <p className="text-sm text-muted-foreground">{word.phonetic}</p>
          </div>
          {word.phonetics[0]?.audio && (
            <Button variant="outline" size="icon" onClick={playAudio}>
              <Play className="h-4 w-4" />
              <span className="sr-only">Play pronunciation</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {word.origin && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Origin
            </h3>
            <p className="text-sm">{word.origin}</p>
          </div>
        )}
        <DottedSeparator className="my-4" />
        <div className="space-y-4">
          {word.meanings.map((meaning: any, index: number) => (
            <WordMeaning key={index} meaning={meaning} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DictionaryCard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DictionaryCardProps {
  word: string;
  onCancel: () => void;
}

export const DictionaryCard: React.FC<DictionaryCardProps> = ({
  word,
  onCancel,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Dictionary
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">{word}</h3>
        <p className="text-sm mb-2">
          <span className="font-semibold">Definition:</span> Sample definition
          for the word.
        </p>
        <p className="text-sm mb-2">
          <span className="font-semibold">Part of Speech:</span> Noun
        </p>
        <p className="text-sm">
          <span className="font-semibold">Example:</span> This is a sample
          sentence using the word.
        </p>
      </CardContent>
    </Card>
  );
};

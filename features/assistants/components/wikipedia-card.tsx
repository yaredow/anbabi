import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WikipediaCardProps {
  word: string;
  onClose: () => void;
}

export const WikipediaCard: React.FC<WikipediaCardProps> = ({
  word,
  onClose,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Wikipedia
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">{word}</h3>
        <p className="text-sm mb-4">
          This is a sample Wikipedia excerpt about the selected word or phrase.
          It would typically contain a brief overview or introduction to the
          topic.
        </p>
        <Button variant="outline" size="sm">
          Read more on Wikipedia
        </Button>
      </CardContent>
    </Card>
  );
};

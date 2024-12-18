import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NoteCardProps {
  word: string;
  onClose: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ word, onClose }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Note
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">Note for: {word}</h3>
        <Textarea
          placeholder="Add your note here..."
          className="w-full"
          rows={4}
        />
        <Button className="mt-2">Save Note</Button>
      </CardContent>
    </Card>
  );
};

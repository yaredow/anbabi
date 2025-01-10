import { useParams } from "next/navigation";

export const useBookId = () => {
  const params = useParams();
  return params.bookId as string;
};

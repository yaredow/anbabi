import { useParams } from "next/navigation";

export const useCollectionId = () => {
  const params = useParams();
  return params.collectionId as string;
};

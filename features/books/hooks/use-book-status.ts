import { useParams } from "next/navigation";

export const useBookStatus = () => {
  const params = useParams();
  return params.status as string;
};

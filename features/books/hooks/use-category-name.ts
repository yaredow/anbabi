import { useParams } from "next/navigation";

export const useCategoryName = () => {
  const params = useParams();
  return params.categoryName as string;
};

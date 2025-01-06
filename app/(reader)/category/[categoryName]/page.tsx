import { BooksGrid } from "@/features/books/components/books-grid";

type PageWithCategoryProps = {
  params: Promise<{ categoryName: string }>;
};

export default async function PageWithCategory({
  params,
}: PageWithCategoryProps) {
  const category = (await params).categoryName;

  return <BooksGrid categoryName={category} />;
}

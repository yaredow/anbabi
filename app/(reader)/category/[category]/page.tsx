type PageWithCategoryProps = {
  params: {
    category: string;
  };
};

export default async function PageWithCategory({
  params,
}: PageWithCategoryProps) {
  const category = await params.category;
  return <main>{category}</main>;
}

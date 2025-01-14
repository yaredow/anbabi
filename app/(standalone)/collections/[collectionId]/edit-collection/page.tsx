type EditCollectionPageProps = {
  params: Promise<{ collectionId: string }>;
};

export default async function EditCollectionPage({
  params,
}: EditCollectionPageProps) {
  const { collectionId } = await params;
  return <main>{collectionId}</main>;
}

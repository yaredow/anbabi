import { redirect } from "next/navigation";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import { Suspense } from "react";

import { auth } from "@/lib/auth";

import CollectionSetting from "@/features/collections/components/collection-setting";

type CollectionSettingsPageProps = {
  params: Promise<{ collectionId: string }>;
};

export default async function CollectionSettingsPage({
  params,
}: CollectionSettingsPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const { collectionId } = await params;

  return (
    <Suspense
      fallback={
        <Loader2 className="flex items-center justify-center mx-auto animate-spin" />
      }
    >
      <CollectionSetting collectionId={collectionId} />
    </Suspense>
  );
}

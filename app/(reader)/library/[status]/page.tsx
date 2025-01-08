import { type ReactElement } from "react";

type PageWithStatusProps = {
  params: Promise<{ status: string }>;
};

export default async function PageWithStatus({ params }: PageWithStatusProps) {
  const status = (await params).status;
  return <main>{status}</main>;
}

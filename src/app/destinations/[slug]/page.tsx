import { destinationsData } from "@/data/destinations";
import DestinationDetailClient from "./DestinationDetailClient";

export async function generateStaticParams() {
  return Object.values(destinationsData).map((d) => ({
    slug: d.slug || d.id,
  }));
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <DestinationDetailClient slug={slug} />;
}


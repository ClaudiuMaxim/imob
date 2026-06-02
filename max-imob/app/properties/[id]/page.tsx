import Link from "next/link";
import PropertyDetails from "./components/property-details";
import Header from "@/app/components/Header";

type PropertyDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params;

  return (
    <main className="bg-light min-vh-100">
     <Header />
      <PropertyDetails propertyId={id} />
    </main>
  );
}

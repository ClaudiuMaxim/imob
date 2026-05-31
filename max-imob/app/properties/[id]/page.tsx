import Link from "next/link";
import PropertyDetails from "./components/property-details";

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
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container py-2">
          <Link className="navbar-brand fw-bold text-primary" href="/">
            Max Imob
          </Link>
          <Link className="btn btn-outline-primary" href="/login">
            Autentificare
          </Link>
        </div>
      </nav>
      <PropertyDetails propertyId={id} />
    </main>
  );
}

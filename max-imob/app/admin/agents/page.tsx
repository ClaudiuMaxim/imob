import Link from "next/link";
import BrandLogo from "@/app/components/BrandLogo";
import AgentsAdmin from "./agents-admin";

export const metadata = {
  title: "Gestionare agenți | Max Imob",
  description: "Administrarea agenților imobiliari din platformă.",
};

export default function AdminAgentsPage() {
  return (
    <main className="bg-light min-vh-100">
      <nav className="navbar bg-white border-bottom">
        <div className="container py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <BrandLogo role="Admin" />
                <div className="d-flex gap-2 flex-wrap">
          <Link className="btn btn-outline-primary" href="/admin/average-prices">
            Pret mediu
          </Link>
          <Link className="btn btn-outline-secondary" href="/">
            Înapoi la site
          </Link>
          </div>
        </div>
      </nav>

      <section className="container py-5">
        <div className="mb-4">
          <p className="text-uppercase text-primary fw-semibold small mb-2">
            Administrare
          </p>
          <h1 className="fw-bold mb-2">Gestionare agenți</h1>
          <p className="text-secondary mb-0">
            Creează agenți, actualizează datele lor și controlează accesul în
            platformă.
          </p>
        </div>

        <AgentsAdmin />
      </section>
    </main>
  );
}

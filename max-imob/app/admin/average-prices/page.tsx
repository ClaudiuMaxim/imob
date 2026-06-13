import Link from "next/link";
import BrandLogo from "@/app/components/BrandLogo";
import AveragePricesAdmin from "./average-prices-admin";

export const metadata = {
  title: "Preturi medii | Max Imob",
  description: "Afisarea preturilor medii pe metru patrat din platforma.",
};

export default function AdminAveragePricesPage() {
  return (
    <main className="bg-light min-vh-100">
      <nav className="navbar bg-white border-bottom">
        <div className="container py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <BrandLogo role="Admin" />
          <div className="d-flex gap-2 flex-wrap">
            <Link className="btn btn-outline-primary" href="/admin/agents">
              Agenti
            </Link>
            <Link className="btn btn-outline-secondary" href="/">
              Inapoi la site
            </Link>
          </div>
        </div>
      </nav>

      <section className="container py-5">
        <div className="mb-4">
          <p className="text-uppercase text-primary fw-semibold small mb-2">
            Administrare
          </p>
          <h1 className="fw-bold mb-2">Preturi medii</h1>
          <p className="text-secondary mb-0">
            Vizualizeaza pretul mediu pe metru patrat pentru fiecare oras, tip
            de proprietate si tip de oferta.
          </p>
        </div>

        <AveragePricesAdmin />
      </section>
    </main>
  );
}

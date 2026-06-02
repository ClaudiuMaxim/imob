import Link from "next/link";
import AgentProperties from "./properties";

export const metadata = {
  title: "Proprietățile mele | Max Imob",
  description: "Administrarea proprietăților de către agent.",
};

export default function AgentPropertiesPage() {
  return (
    <main className="bg-light min-vh-100">
      <nav className="navbar bg-white border-bottom">
        <div className="container py-2 d-flex justify-content-between align-items-center">
          <div>
            <Link className="navbar-brand fw-bold text-primary" href="/">
              Max Imob Agent
            </Link>
          </div>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary btn-sm" href="/agent/messages">
              Mesaje
            </Link>
            <Link className="btn btn-outline-secondary btn-sm" href="/">
              Înapoi la site
            </Link>
          </div>
        </div>
      </nav>

      <section className="container py-5">
        <div className="mb-4">
          <p className="text-uppercase text-primary fw-semibold small mb-2">
            Proprietăți
          </p>
          <h1 className="fw-bold mb-2">Proprietățile mele</h1>
          <p className="text-secondary mb-0">
            Creează, editează și administrează statusul proprietăților tale.
          </p>
        </div>

        <AgentProperties />
      </section>
    </main>
  );
}

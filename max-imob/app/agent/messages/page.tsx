import Link from "next/link";
import BrandLogo from "@/app/components/BrandLogo";
import MessagesList from "./components/messages-list";

export const metadata = {
  title: "Mesaje primite | Max Imob Agent",
  description: "Lista mesajelor primite de agent din formularul de contact.",
};

export default function AgentMessagesPage() {
  return (
    <main className="bg-light min-vh-100">
      <nav className="navbar bg-white border-bottom">
        <div className="container py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <BrandLogo role="Agent" />
          </div>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary" href="/agent/properties">
              Proprietăți
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
            Mesaje
          </p>
          <h1 className="fw-bold mb-2">Mesaje primite</h1>
          <p className="text-secondary mb-0">
            Vezi mesajele trimise prin formularul de contact pentru proprietățile tale.
          </p>
        </div>
        <MessagesList />
      </section>
    </main>
  );
}

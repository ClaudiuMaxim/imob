import Link from "next/link";
import PropertiesBrowser from "./components/properties-browser";

export default function PropertiesPage() {
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
      <PropertiesBrowser />
    </main>
  );
}

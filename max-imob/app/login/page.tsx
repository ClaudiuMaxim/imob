import Link from "next/link";
import LoginForm from "./login-form";

export const metadata = {
  title: "Autentificare | Max Imob",
  description: "Autentificare pentru administratori și agenți.",
};

export default function LoginPage() {
  return (
    <main className="bg-light min-vh-100">
      <nav className="navbar bg-white border-bottom">
        <div className="container py-2">
          <Link className="navbar-brand fw-bold text-primary" href="/">
            Max Imob
          </Link>
          <Link className="btn btn-outline-secondary" href="/">
            Înapoi la site
          </Link>
        </div>
      </nav>

      <section className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <p className="text-uppercase text-primary fw-semibold small mb-2">
                  Acces personal
                </p>
                <h1 className="h3 fw-bold mb-3">Autentificare</h1>
                <p className="text-secondary mb-4">
                  Login-ul este disponibil doar pentru administratori și agenți.
                  Utilizatorii publici pot naviga site-ul fără cont.
                </p>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

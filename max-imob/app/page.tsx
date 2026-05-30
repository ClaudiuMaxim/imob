import Link from "next/link";

const highlights = [
  {
    title: "Listări publice",
    text: "Proprietățile pot fi descoperite rapid de orice vizitator, fără autentificare.",
  },
  {
    title: "Administrare pentru agenți",
    text: "Agenții vor putea gestiona propriile proprietăți, statusuri și lead-uri.",
  },
  {
    title: "Control administrativ",
    text: "Administratorii vor gestiona agenții și accesul acestora în platformă.",
  },
];

const roles = [
  {
    title: "Utilizator public",
    text: "Vizualizează proprietăți și trimite mesaje fără cont.",
  },
  {
    title: "Agent",
    text: "Se autentifică pentru a administra proprietăți și lead-uri.",
  },
  {
    title: "Administrator",
    text: "Se autentifică pentru a administra conturile agenților.",
  },
];

function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container py-2">
        <Link className="navbar-brand fw-bold text-primary" href="/">
          Max Imob
        </Link>
        <div className="d-flex gap-3 align-items-center">
          <Link className="nav-link text-secondary" href="/properties">
            Proprietăți
          </Link>
          <Link className="btn btn-outline-primary" href="/login">
            Autentificare
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="bg-white">
      <div className="container py-5">
        <div className="row align-items-center g-5 py-lg-5">
          <div className="col-lg-7">
            <p className="text-uppercase text-primary fw-semibold small mb-3">
              Marketplace imobiliar public
            </p>
            <h1 className="display-4 fw-bold mb-4">
              Găsește proprietăți potrivite fără cont de utilizator.
            </h1>
            <p className="lead text-secondary mb-4">
              Max Imob conectează vizitatorii cu proprietăți publice, iar
              agenții și administratorii gestionează datele prin zone dedicate.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3">
              <Link className="btn btn-primary btn-lg" href="/properties">
                Vezi proprietăți
              </Link>
              <Link className="btn btn-outline-secondary btn-lg" href="/login">
                Login agent sau admin
              </Link>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <span className="badge text-bg-success mb-3">
                  Acces public
                </span>
                <h2 className="h4 fw-bold mb-3">
                  Navigare simplă pentru cumpărători și chiriași
                </h2>
                <p className="text-secondary mb-0">
                  Vizitatorii pot consulta listări, detalii despre proprietăți
                  și pot trimite mesaje prin formularul de contact, fără cont.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  return (
    <section className="container py-5">
      <div className="row g-4">
        {highlights.map((item) => (
          <div className="col-md-4" key={item.title}>
            <article className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h5 fw-bold">{item.title}</h2>
                <p className="text-secondary mb-0">{item.text}</p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}

function RoleOverview() {
  return (
    <section className="bg-white border-top border-bottom">
      <div className="container py-5">
        <div className="row g-4 align-items-start">
          <div className="col-lg-4">
            <h2 className="fw-bold">Roluri în sistem</h2>
            <p className="text-secondary mb-0">
              Platforma separă clar accesul public de funcționalitățile
              protejate pentru personal.
            </p>
          </div>
          <div className="col-lg-8">
            <div className="list-group">
              {roles.map((role) => (
                <div className="list-group-item py-3" key={role.title}>
                  <h3 className="h6 fw-bold mb-1">{role.title}</h3>
                  <p className="mb-0 text-secondary">{role.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="container py-4">
      <p className="text-secondary small mb-0">
        Max Imob - platformă imobiliară pentru lucrarea de licență.
      </p>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Highlights />
      <RoleOverview />
      <Footer />
    </main>
  );
}

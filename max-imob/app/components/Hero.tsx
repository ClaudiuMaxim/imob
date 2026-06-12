import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-light overflow-hidden">
      <div className="container">
        <div className="row align-items-center py-5">
          <div className="col-lg-6 py-4">
            <h1 className="display-5 fw-bold text-dark mb-3">
              Găsește proprietatea potrivită
            </h1>
            <p className="fs-5 text-secondary mb-4" style={{ maxWidth: "520px" }}>
              Platformă imobiliară pentru locuințe, terenuri și spații comerciale.
            </p>
            <Link className="btn btn-primary btn-lg px-4" href="/properties">
              Vezi proprietăți <i className="bi bi-chevron-right ms-2"></i>
            </Link>
          </div>

          <div className="col-lg-6">
            <div
              className="position-relative"
              style={{
                minHeight: "320px",
                backgroundImage:
                  "linear-gradient(90deg, #f8f9fa 0%, rgba(248, 249, 250, 0.75) 10%, rgba(248, 249, 250, 0) 28%), url('/hero.webp')",
                backgroundPosition: "center",
                backgroundSize: "cover",
              }}
              aria-label="Cladire moderna de apartamente"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

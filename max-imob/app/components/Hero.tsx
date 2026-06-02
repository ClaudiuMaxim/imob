import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="text-white"
      style={{
        backgroundImage:
          "url('https://www.estimob.ro/assets/images/Agentie_Imobiliara_Brasov_Estimob.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "60vh",
      }}
    >
      <div className="bg-dark bg-opacity-50 h-100 d-flex align-items-center">
        <div className="container text-center py-5">
          <p className="text-uppercase fw-semibold mb-2 text-white-75">Max Imob</p>
          <h1 className="display-3 fw-bold mb-3">Găsește proprietatea potrivită pentru tine</h1>
          <p className="lead text-white-75 mb-4">
            Cele mai noi anunțuri de vânzare și închiriere, direct de la agenți.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link className="btn btn-light btn-lg text-dark" href="/properties?offerType=vanzare">
              Vanzare
            </Link>
            <Link className="btn btn-outline-light btn-lg" href="/properties?offerType=inchiriere">
              Inchiriere
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

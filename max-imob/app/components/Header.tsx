import Link from "next/link";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-transparent py-3">
      <div className="container d-flex justify-content-between gap-2">
         <Link className="navbar-brand fw-bold text-primary" href="/">
            Max Imob
          </Link>  
        <div className="d-flex gap-2">
            <Link className="btn btn-outline-dark btn-sm" href="/properties?offerType=vanzare">
            Vanzare
            </Link>
            <Link className="btn btn-outline-dark btn-sm" href="/properties?offerType=inchiriere">
            Inchiriere
            </Link>
            <Link className="btn btn-light btn-sm text-dark" href="/login">
            Autentificare
            </Link>
        </div>
      </div>
    </nav>
  );
}

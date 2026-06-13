import Link from "next/link";
import BrandLogo from "./BrandLogo";

export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg bg-transparent py-3">
      <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <BrandLogo />
        <div className="d-flex gap-2">
            <Link className="btn btn-outline-dark btn-sm" href="/properties?offerType=vanzare">
            Vanzare
            </Link>
            <Link className="btn btn-outline-dark btn-sm" href="/properties?offerType=inchiriere">
            Inchiriere
            </Link>
            <Link className="btn btn-light btn-sm text-dark" href="/login">
            <i className="bi bi-person-circle me-1"></i>
            Autentificare
            </Link>
        </div>
      </div>
    </nav>
  );
}

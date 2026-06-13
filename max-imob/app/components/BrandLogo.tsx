import Image from "next/image";
import Link from "next/link";

type BrandLogoProps = {
  context?: string;
};

export default function BrandLogo({ context }: BrandLogoProps) {
  return (
    <Link className="navbar-brand d-flex align-items-center gap-2 mb-0" href="/">
      <Image
        alt="Max Imob"
        height={34}
        priority
        src="/logo-max-imob.svg"
        width={139}
      />
      {context ? (
        <span className="badge text-bg-light border text-secondary">{context}</span>
      ) : null}
    </Link>
  );
}

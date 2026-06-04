'use client';
export default function Footer() {
  const socials = [
    { href: "#", icon: "bi-tiktok", label: "TikTok" },
    { href: "#", icon: "bi-facebook", label: "Facebook" },
    { href: "#", icon: "bi-twitter-x", label: "X" },
    { href: "#", icon: "bi-instagram", label: "Instagram" },
    { href: "#", icon: "bi-youtube", label: "YouTube" },
  ];

  return (
    <footer className="container py-4">
      <div className="d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3">
        <p className="text-secondary small mb-0">
          Max Imob - platformă imobiliară pentru lucrarea de licență.
        </p>
        <div className="d-flex gap-3">
          {socials.map(({ href, icon, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="text-secondary fs-5 link-offset-2"
              style={{ transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0d6efd")}
              onMouseLeave={e => (e.currentTarget.style.color = "")}
            >
              <i className={`bi ${icon}`} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
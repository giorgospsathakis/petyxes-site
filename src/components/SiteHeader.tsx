import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import logo from "@/assets/logo-petyxes.png";

const links = [
  { to: "/", label: "Αρχική" },
  { to: "/frontistirio", label: "Το φροντιστήριο" },
  { to: "/mathimata", label: "Μαθήματα" },
  { to: "/epitychies", label: "Επιτυχίες" },
  { to: "/epikoinonia", label: "Επικοινωνία" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div
        className={`mx-auto flex max-w-7xl gap-4 px-5 transition-all duration-300 ${
          scrolled ? "flex-row items-center justify-between py-3" : "flex-col items-center justify-center py-6 md:py-8"
        }`}
      >
        <Link to="/" className="flex items-center" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Πέτυχες!"
            className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-9" : "h-20 md:h-24"}`}
          />
        </Link>

        <nav className={`hidden items-center gap-1 md:flex ${scrolled ? "" : "mt-2"}`}>
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "rounded-full px-4 py-2 text-sm font-semibold bg-primary/15 text-primary" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label="Μενού"
          className={`rounded-full p-2 text-foreground transition-colors hover:bg-secondary md:hidden ${scrolled ? "" : "mt-2"}`}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 pb-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

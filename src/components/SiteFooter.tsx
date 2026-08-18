import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-accent py-10 text-sm text-accent-foreground/70">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-5 text-center">
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="/frontistirio" className="hover:text-accent-foreground">Το φροντιστήριο</Link>
          <Link to="/mathimata" className="hover:text-accent-foreground">Μαθήματα</Link>
          <Link to="/epitychies" className="hover:text-accent-foreground">Επιτυχίες</Link>
          <Link to="/epikoinonia" className="hover:text-accent-foreground">Επικοινωνία</Link>
        </nav>
        <div>
          <p className="font-bold text-accent-foreground">
            © {new Date().getFullYear()} Πέτυχες! — Κέντρο Μελέτης & Φροντιστήριο
          </p>
          <p className="mt-1">Όλα τα δικαιώματα διατηρούνται.</p>
        </div>
      </div>
    </footer>
  );
}

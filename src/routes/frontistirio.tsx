import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import heroStudents from "@/assets/hero-students.jpg";
import heroTeacher from "@/assets/hero-teacher.jpg";
import { offerings } from "@/lib/site-data";
import { siteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/frontistirio")({
  head: () => ({
    meta: [
      { title: "Το φροντιστήριο — Πέτυχες! Κέντρο Μελέτης" },
      {
        name: "description",
        content:
          "Γνωρίστε τη φιλοσοφία, τους καθηγητές και τον χώρο του φροντιστηρίου «Πέτυχες!». Μικρά τμήματα, φροντίδα και συνεργασία με τους γονείς.",
      },
      { property: "og:title", content: "Το φροντιστήριο — Πέτυχες!" },
      { property: "og:description", content: "Η φιλοσοφία, οι καθηγητές και ο χώρος του φροντιστηρίου «Πέτυχες!»." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/frontistirio") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/frontistirio") }],
  }),
  component: AboutPage,
});

const values = [
  "Έμπειροι και φιλόδοξοι καθηγητές",
  "Μικρά και ομοιογενή τμήματα",
  "Σύγχρονες μεθοδολογίες διδασκαλίας",
  "Άμεση ενημέρωση γονέων",
  "Φιλικό και ασφαλές περιβάλλον",
];

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-accent-foreground">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider">Το φροντιστήριο</span>
              </div>
              <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Ένας χώρος φτιαγμένος για μαθητές.
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Το «Πέτυχες!» είναι κέντρο μελέτης και φροντιστήριο, όπου κάθε μαθητής ανακαλύπτει τις δυνατότητές του,
                βελτιώνει τις επιδόσεις του και χτίζει αυτοπεποίθηση. Πιστεύουμε στη συνεργασία μεταξύ μαθητή, καθηγητή
                και γονέα.
              </p>
              <ul className="space-y-4">
                {values.map((v) => (
                  <li key={v} className="flex items-start gap-3 text-foreground">
                    <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-primary" />
                    <span className="font-medium">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <img
                src={heroStudents}
                alt="Μαθητές στο φροντιστήριο"
                className="h-72 w-full rounded-[2rem] border-4 border-white object-cover shadow-xl sm:h-96"
                loading="lazy"
              />
              <img
                src={heroTeacher}
                alt="Καθηγητής εξηγεί σε μαθητή"
                className="h-72 w-full rounded-[2rem] border-4 border-white object-cover shadow-xl sm:mt-10 sm:h-96"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="bg-secondary/50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5">
            <h2 className="mb-10 text-3xl font-bold text-foreground md:text-4xl">Τι προσφέρουμε</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {offerings.map((o) => {
                const Icon = o.icon;
                return (
                  <div key={o.title} className="rounded-[2rem] border border-border bg-card p-7">
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mb-2 text-lg font-bold text-foreground">{o.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{o.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

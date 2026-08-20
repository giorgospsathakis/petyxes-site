import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { courseGroups, activities } from "@/lib/site-data";
import { siteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/mathimata")({
  head: () => ({
    meta: [
      { title: "Μαθήματα & τμήματα — Πέτυχες!" },
      {
        name: "description",
        content:
          "Τμήματα Γυμνασίου, Λυκείου και προετοιμασία για Πανελλαδικές. Δείτε τα μαθήματα, τις κατευθύνσεις και τις δράσεις του φροντιστηρίου.",
      },
      { property: "og:title", content: "Μαθήματα & τμήματα — Πέτυχες!" },
      { property: "og:description", content: "Τμήματα Γυμνασίου, Λυκείου και προετοιμασία για Πανελλαδικές." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/mathimata") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/mathimata") }],
  }),
  component: CoursesPage,
});

const featuredActivities = ["Εργαστήρια δεξιοτήτων", "Ανοιχτές εκδηλώσεις γονέων"];

function CoursesPage() {
  const shownActivities = activities.filter((a) => featuredActivities.includes(a.title));
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
          <div className="max-w-3xl space-y-5">
            <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl">Μαθήματα & τμήματα</h1>
            <p className="text-lg text-muted-foreground">
              Οργανωμένα, ολιγομελή τμήματα σε κάθε τάξη — με πρόγραμμα προσαρμοσμένο στις ανάγκες κάθε μαθητή.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {courseGroups.map((g) => (
              <div key={g.title} className="rounded-[2rem] border border-border bg-card p-8 transition-shadow hover:shadow-xl">
                <h2 className="text-xl font-bold text-foreground">{g.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.text}</p>
                <ul className="mt-6 space-y-3">
                  {g.subjects.map((s) => (
                    <li key={s} className="flex items-start gap-3 text-sm font-medium text-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-primary" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-secondary/50 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-5">
            <div className="mx-auto mb-12 max-w-2xl space-y-4 text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">Δράσεις & εκδηλώσεις</h2>
              <p className="text-lg text-muted-foreground">Μαθαίνουμε μέσα και έξω από την τάξη.</p>
            </div>
           <div className="grid gap-6 md:grid-cols-2">
              {shownActivities.map((a) => {
                const Icon = a.icon;
                return (
                  <div key={a.title} className="overflow-hidden rounded-[2rem] border border-border bg-card">
                    <img src={a.image} alt={a.title} className="h-44 w-full object-cover" loading="lazy" />
                    <div className="p-6 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-foreground">{a.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{a.text}</p>
                    </div>
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

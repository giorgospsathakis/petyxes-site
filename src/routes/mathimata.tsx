import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchCourseGroups } from "@/lib/site-content";
import { siteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/mathimata")({
  head: () => ({
    meta: [
      { title: "Μαθήματα & τμήματα — Πέτυχες!" },
      {
        name: "description",
        content:
          "Τμήματα Γυμνασίου, Λυκείου και προετοιμασία για Πανελλαδικές. Δείτε τα μαθήματα και τις κατευθύνσεις του φροντιστηρίου.",
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

function CoursesPage() {
  const { data: courseGroups = [] } = useQuery({ queryKey: ["course_groups"], queryFn: fetchCourseGroups });
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
              <div key={g.id} className="rounded-[2rem] border border-border bg-card p-8 transition-shadow hover:shadow-xl">
                <h2 className="text-xl font-bold text-foreground">{g.title}</h2>
                {g.description && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.description}</p>
                )}
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
      </main>
      <SiteFooter />
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, ArrowRight } from "lucide-react";

import heroStudents from "@/assets/hero-students.jpg";
import heroTeacher from "@/assets/hero-teacher.jpg";
import heroStudy from "@/assets/hero-study.jpg";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { offerings, activities } from "@/lib/site-data";
import { useQuery } from "@tanstack/react-query";
import { siteUrl } from "@/lib/site-url";
import {
  categoryLabels,
  fetchPublishedPosts,
  formatDate,
  type PostCategory,
  type SitePost,
} from "@/lib/site-content";

function PostGrid({ posts }: { posts: SitePost[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const img = post.image_url ?? null;
        return (
          <article
            key={post.id}
            className="group overflow-hidden rounded-[2rem] border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            {img && (
              <div className="h-52 overflow-hidden">
                <img
                  src={img}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            )}
            <div className="space-y-3 p-6">
              <div className="text-xs font-bold uppercase tracking-wide text-primary">
                {post.event_date ? formatDate(post.event_date) : categoryLabels[post.category]}
              </div>
              <h3 className="text-lg font-bold text-foreground">{post.title}</h3>
              {post.body && (
                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{post.body}</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function DynamicSections() {
  const { data } = useQuery({ queryKey: ["site_posts", "public"], queryFn: fetchPublishedPosts });
  const posts = data ?? [];
  const by = (c: PostCategory) => posts.filter((p) => p.category === c);

  const sections: Array<{ id: string; title: string; subtitle: string; items: SitePost[]; tinted: boolean }> = [
    {
      id: "anakoinoseis",
      title: "Ανακοινώσεις",
      subtitle: "Τα τελευταία νέα του φροντιστηρίου.",
      items: by("announcement"),
      tinted: false,
    },
    {
      id: "neas-draseis",
      title: "Πρόσφατες δράσεις",
      subtitle: "Στιγμές από τις εκδηλώσεις και τις δραστηριότητές μας.",
      items: by("activity"),
      tinted: true,
    },
    {
      id: "epitychies",
      title: "Επιτυχίες μαθητών",
      subtitle: "Οι μαθητές μας πετυχαίνουν τους στόχους τους.",
      items: by("success"),
      tinted: false,
    },
  ].filter((s) => s.items.length > 0);

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((s) => (
        <section key={s.id} id={s.id} className={s.tinted ? "bg-secondary/50 py-20 md:py-24" : "py-20 md:py-24"}>
          <div className="mx-auto max-w-7xl px-5">
            <div className="mb-12 space-y-4">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">{s.title}</h2>
              <p className="text-lg text-muted-foreground">{s.subtitle}</p>
            </div>
            <PostGrid posts={s.items} />
          </div>
        </section>
      ))}
    </>
  );
}


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Πέτυχες! — Κέντρο Μελέτης & Φροντιστήριο" },
      {
        name: "description",
        content:
          "Φροντιστηριακά μαθήματα, κέντρο μελέτης και δημιουργικές δράσεις για μαθητές Γυμνασίου και Λυκείου. Ανακαλύψτε τις παροχές και τις δράσεις μας.",
      },
      { property: "og:title", content: "Πέτυχες! — Κέντρο Μελέτης & Φροντιστήριο" },
      {
        property: "og:description",
        content: "Φροντιστηριακά μαθήματα, κέντρο μελέτης και δημιουργικές δράσεις για μαθητές.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/") }],
  }),
  component: PublicSite,
});

function PublicSite() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-5 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-accent text-accent-foreground rounded-full">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                <span className="text-xs font-bold tracking-wider uppercase">Κέντρο Μελέτης & Φροντιστήριο</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-foreground">
                Εδώ μαθαίνεις και{" "}
                <span className="relative inline-block text-primary">
                  πετυχαίνεις.
                  <span className="absolute bottom-2 left-0 w-full h-4 bg-primary/20 -z-10 rounded-sm" />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Φροντιστηριακά μαθήματα, κέντρο μελέτης και δημιουργικές δράσεις. Ένας χώρος που συνδυάζει γνώση, φροντίδα και έμπνευση.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild size="lg" className="group relative overflow-hidden hover:pr-12 transition-all">
                  <a href="/epikoinonia">
                    Επικοινωνήστε μαζί μας
                    <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2">
                  <a href="/mathimata">Οι παροχές μας</a>
                </Button>
              </div>
            </div>

            {/* Visual Mosaic Grid */}
            <div className="relative grid grid-cols-12 grid-rows-12 gap-3 h-[420px] md:h-[560px]">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />

              <div className="col-span-8 row-span-8 rounded-[2.5rem] overflow-hidden shadow-2xl relative border-8 border-white group">
                <img
                  src={heroStudents}
                  alt="Μαθητές σε φροντιστήριο"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  width={1024}
                  height={1024}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/40 to-transparent" />
              </div>

              <div className="col-span-4 row-span-5 col-start-9 row-start-2 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white translate-y-4">
                <img
                  src={heroTeacher}
                  alt="Καθηγητής εξηγεί σε μαθητή"
                  className="w-full h-full object-cover"
                  width={1024}
                  height={1024}
                  loading="lazy"
                />
              </div>

              <div className="col-span-6 row-span-4 col-start-3 row-start-9 bg-accent rounded-[2rem] overflow-hidden shadow-xl border-4 border-white flex items-center justify-center p-6 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">20+</div>
                  <div className="text-white text-sm font-medium">Έτη Εμπειρίας στην Εκπαίδευση</div>
                </div>
              </div>

              <div className="col-span-4 row-span-4 col-start-9 row-start-7 rounded-[2rem] overflow-hidden shadow-xl border-4 border-white">
                <img
                  src={heroStudy}
                  alt="Χώρος μελέτης"
                  className="w-full h-full object-cover"
                  width={1024}
                  height={1024}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-accent text-accent-foreground py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm font-bold">Ένας χώρος φτιαγμένος για μαθητές</span>
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                  Το «Πέτυχες!» είναι πολύ περισσότερο από ένα φροντιστήριο.
                </h2>
                <p className="text-lg text-primary-foreground/80 leading-relaxed">
                  Είναι ένα κέντρο μελέτης και δημιουργίας όπου κάθε μαθητής ανακαλύπτει τις δυνατότητές του, βελτιώνει τις επιδόσεις του και χτίζει αυτοπεποίθηση.
                </p>
                <p className="text-lg text-primary-foreground/80 leading-relaxed">
                  Πιστεύουμε στη συνεργασία μεταξύ μαθητή, καθηγητή και γονέα. Κάθε παιδί είναι ξεχωριστό, και η προσέγγισή μας προσαρμόζεται στις ανάγκες του.
                </p>
              </div>
              <div className="rounded-[2.5rem] bg-primary/10 p-8 md:p-10">
                <ul className="space-y-6">
                  {[
                    "Έμπειροι και φιλόδοξοι καθηγητές",
                    "Μικρά και ομοιογενή τμήματα",
                    "Σύγχρονες μεθοδολογίες διδασκαλίας",
                    "Άμεση ενημέρωση γονέων",
                    "Φιλικό και ασφαλές περιβάλλον",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-4 text-lg">
                      <span className="mt-2 h-2.5 w-2.5 flex-none rounded-full bg-primary" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Offerings */}
        <section id="paroxes" className="mx-auto max-w-7xl px-5 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Οι παροχές μας</h2>
              <p className="text-muted-foreground text-lg">Ολοκληρωμένη υποστήριξη σε κάθε στάδιο της μαθητικής πορείας.</p>
            </div>
            <div className="hidden md:block w-24 h-1 bg-primary rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((o) => {
              const Icon = o.icon;
              return (
                <div
                  key={o.title}
                  className="group bg-card rounded-[2rem] overflow-hidden border border-border transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10"
                >
                  <div className="h-56 relative overflow-hidden">
                    <img
                      src={o.image}
                      alt={o.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      width={1024}
                      height={768}
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 p-3 bg-white/90 backdrop-blur rounded-2xl shadow-sm text-accent">
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-foreground mb-3 transition-colors group-hover:text-primary">{o.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{o.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Activities */}
        <section className="bg-secondary/50 py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Δράσεις & εκδηλώσεις</h2>
              <p className="text-muted-foreground text-lg">Μαθαίνουμε μέσα και έξω από την τάξη.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.title}
                    className="group bg-card rounded-[2rem] overflow-hidden border border-border transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        width={1024}
                        height={768}
                        loading="lazy"
                      />
                    </div>
                    <div className="p-6 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{a.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{a.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <DynamicSections />

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 py-20 md:py-28">
          <div className="rounded-[2.5rem] bg-accent px-8 py-14 text-center text-accent-foreground md:px-16">
            <h2 className="text-3xl font-bold md:text-4xl">Θέλετε να μάθετε περισσότερα;</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
              Δείτε τα τμήματα και το πρόγραμμά μας ή επικοινωνήστε μαζί μας για μια πρώτη γνωριμία.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <a href="/epikoinonia">Επικοινωνία</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 bg-transparent">
                <a href="/mathimata">Τα μαθήματά μας</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

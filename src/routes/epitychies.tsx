import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { fetchPublishedPosts, formatDate, categoryLabels, type SitePost } from "@/lib/site-content";
import { siteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/epitychies")({
  head: () => ({
    meta: [
      { title: "Επιτυχίες μαθητών — Πέτυχες!" },
      {
        name: "description",
        content:
          "Οι επιτυχίες των μαθητών μας σε Πανελλαδικές και σχολικές εξετάσεις. Στόχοι που έγιναν πράξη με μεθοδική δουλειά.",
      },
      { property: "og:title", content: "Επιτυχίες μαθητών — Πέτυχες!" },
      { property: "og:description", content: "Οι επιτυχίες των μαθητών μας σε Πανελλαδικές και σχολικές εξετάσεις." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/epitychies") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/epitychies") }],
  }),
  component: SuccessPage,
});

function Card({ post }: { post: SitePost }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-border bg-card transition-shadow hover:shadow-xl">
      {post.image_url && (
        <img src={post.image_url} alt={post.title} className="h-52 w-full object-cover" loading="lazy" />
      )}
      <div className="space-y-3 p-6">
        <div className="text-xs font-bold uppercase tracking-wide text-primary">
          {post.event_date ? formatDate(post.event_date) : categoryLabels[post.category]}
        </div>
        <h2 className="text-lg font-bold text-foreground">{post.title}</h2>
        {post.body && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{post.body}</p>
        )}
      </div>
    </article>
  );
}

function SuccessPage() {
  const { data, isLoading } = useQuery({ queryKey: ["site_posts", "public"], queryFn: fetchPublishedPosts });
  const posts = (data ?? []).filter((p) => p.category === "success");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="max-w-3xl space-y-5">
          <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl">Επιτυχίες μαθητών</h1>
          <p className="text-lg text-muted-foreground">
            Κάθε επιτυχία είναι αποτέλεσμα συνεργασίας, συνέπειας και μεθοδικής δουλειάς.
          </p>
        </div>

        <div className="mt-12">
          {isLoading ? (
            <p className="text-muted-foreground">Φόρτωση…</p>
          ) : posts.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              Σύντομα θα δημοσιεύσουμε εδώ τις επιτυχίες των μαθητών μας.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Card key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

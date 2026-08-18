import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useRoles, useSession } from "@/lib/auth";
import {
  categoryLabels,
  deleteMedia,
  fetchAllPosts,
  formatDate,
  swapOrder,
  uploadMedia,
  type PostCategory,
  type SitePost,
} from "@/lib/site-content";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/landing")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Διαχείριση περιεχομένου — Πέτυχες!" },
      { name: "description", content: "Διαχείριση ανακοινώσεων, δράσεων και επιτυχιών της ιστοσελίδας." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Διαχείριση περιεχομένου — Πέτυχες!" },
      { property: "og:description", content: "Ενημέρωση περιεχομένου ιστοσελίδας." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LandingAdmin,
});

const categories: PostCategory[] = ["announcement", "activity", "success"];

function LandingAdmin() {
  const { session, loading } = useSession();
  const { isAdmin, loading: rolesLoading } = useRoles();

  if (loading || (session && rolesLoading)) {
    return <Centered>Φόρτωση…</Centered>;
  }
  if (!session) return <LoginForm />;
  if (!isAdmin) {
    return (
      <Centered>
        Ο λογαριασμός σας δεν έχει δικαιώματα διαχειριστή.
        <button
          className="mt-4 block text-sm underline"
          onClick={() => supabase.auth.signOut()}
          type="button"
        >
          Αποσύνδεση
        </button>
      </Centered>
    );
  }
  return <Manager />;
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-center text-muted-foreground">
      <div>{children}</div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error("Λάθος στοιχεία σύνδεσης.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/40 p-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-[2rem] border border-border bg-card p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-foreground">Διαχείριση ιστοσελίδας</h1>
        <p className="text-sm text-muted-foreground">Συνδεθείτε για να ενημερώσετε το περιεχόμενο.</p>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Κωδικός"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
        />
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Σύνδεση…" : "Σύνδεση"}
        </Button>
      </form>
    </div>
  );
}

type FormState = {
  category: PostCategory;
  title: string;
  body: string;
  event_date: string;
  published: boolean;
  file: File | null;
};

const emptyForm: FormState = {
  category: "announcement",
  title: "",
  body: "",
  event_date: "",
  published: true,
  file: null,
};

function Manager() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<PostCategory | "all">("all");

  const postsQuery = useQuery({ queryKey: ["site_posts", "all"], queryFn: fetchAllPosts });

  const save = useMutation({
    mutationFn: async () => {
      let imagePath: string | null | undefined;
      if (form.file) imagePath = await uploadMedia(form.file);

      const payload = {
        category: form.category,
        title: form.title.trim(),
        body: form.body.trim() || null,
        event_date: form.event_date || null,
        published: form.published,
        ...(imagePath !== undefined ? { image_path: imagePath } : {}),
      };

      if (editingId) {
        const { error } = await supabase.from("site_posts").update(payload).eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingId ? "Αποθηκεύτηκε." : "Δημοσιεύτηκε.");
      setForm(emptyForm);
      setEditingId(null);
      void queryClient.invalidateQueries({ queryKey: ["site_posts"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Κάτι πήγε στραβά."),
  });

  const remove = useMutation({
    mutationFn: async (post: SitePost) => {
      const { error } = await supabase.from("site_posts").delete().eq("id", post.id);
      if (error) throw error;
      await deleteMedia(post.image_path);
    },
    onSuccess: () => {
      toast.success("Διαγράφηκε.");
      void queryClient.invalidateQueries({ queryKey: ["site_posts"] });
    },
  });

  const togglePublished = useMutation({
    mutationFn: async (post: SitePost) => {
      const { error } = await supabase
        .from("site_posts")
        .update({ published: !post.published })
        .eq("id", post.id);
      if (error) throw error;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["site_posts"] }),
  });

  const reorder = useMutation({
    mutationFn: async ({ a, b }: { a: SitePost; b: SitePost }) => swapOrder(a, b),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["site_posts"] }),
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Κάτι πήγε στραβά."),
  });

  function startEdit(post: SitePost) {
    setEditingId(post.id);
    setForm({
      category: post.category,
      title: post.title,
      body: post.body ?? "",
      event_date: post.event_date ?? "",
      published: post.published,
      file: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const allPosts = [...(postsQuery.data ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order || b.created_at.localeCompare(a.created_at),
  );
  const posts = filter === "all" ? allPosts : allPosts.filter((p) => p.category === filter);
  const counts = {
    all: allPosts.length,
    announcement: allPosts.filter((p) => p.category === "announcement").length,
    activity: allPosts.filter((p) => p.category === "activity").length,
    success: allPosts.filter((p) => p.category === "success").length,
  } as const;

  return (
    <div className="min-h-screen bg-secondary/30 pb-20">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <h1 className="text-lg font-bold text-foreground">Διαχείριση ιστοσελίδας</h1>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
              Προβολή σελίδας
            </a>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
              Αποσύνδεση
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-5 py-8">
        <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
          <h2 className="mb-6 text-xl font-bold text-foreground">
            {editingId ? "Επεξεργασία καταχώρησης" : "Νέα καταχώρηση"}
          </h2>
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
          >
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">Κατηγορία</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as PostCategory })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {categoryLabels[c]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">Ημερομηνία (προαιρετικά)</span>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                />
              </label>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">Τίτλος</span>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="π.χ. Εγγραφές για τη νέα χρονιά"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">Κείμενο</span>
              <textarea
                rows={4}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Γράψτε εδώ τις λεπτομέρειες…"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-foreground">Φωτογραφία (προαιρετικά)</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, file: e.target.files?.[0] ?? null })}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
              />
            </label>

            <label className="flex items-center gap-3 text-sm font-semibold text-foreground">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="h-4 w-4"
              />
              Ορατό στη δημόσια σελίδα
            </label>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Αποθήκευση…" : editingId ? "Αποθήκευση αλλαγών" : "Δημοσίευση"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Ακύρωση
                </Button>
              )}
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">Καταχωρήσεις</h2>
            <div className="flex flex-wrap gap-2">
              {(["all", ...categories] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                    filter === c
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c === "all" ? "Όλα" : categoryLabels[c]} ({counts[c]})
                </button>
              ))}
            </div>
          </div>
          {postsQuery.isLoading && <p className="text-sm text-muted-foreground">Φόρτωση…</p>}
          {!postsQuery.isLoading && posts.length === 0 && (
            <p className="text-sm text-muted-foreground">Δεν υπάρχουν καταχωρήσεις ακόμη.</p>
          )}
          <div className="space-y-3">
            {posts.map((post, index) => {
              const img = post.image_url ?? null;
              return (
                <article
                  key={post.id}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center"
                >
                  {img ? (
                    <img
                      src={img}
                      alt={post.title}
                      className="h-20 w-28 flex-none rounded-xl object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-20 w-28 flex-none rounded-xl bg-secondary" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold uppercase tracking-wide text-primary">
                      {categoryLabels[post.category]}
                      {post.event_date ? ` · ${formatDate(post.event_date)}` : ""}
                      {post.published ? "" : " · κρυφό"}
                    </div>
                    <h3 className="truncate text-base font-bold text-foreground">{post.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{post.body}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={index === 0 || reorder.isPending}
                      onClick={() => reorder.mutate({ a: post, b: posts[index - 1]! })}
                      aria-label="Μετακίνηση πάνω"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={index === posts.length - 1 || reorder.isPending}
                      onClick={() => reorder.mutate({ a: post, b: posts[index + 1]! })}
                      aria-label="Μετακίνηση κάτω"
                    >
                      ↓
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => startEdit(post)}>
                      Επεξεργασία
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => togglePublished.mutate(post)}>
                      {post.published ? "Απόκρυψη" : "Εμφάνιση"}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Διαγραφή καταχώρησης;")) remove.mutate(post);
                      }}
                    >
                      Διαγραφή
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

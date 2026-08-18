import { supabase } from "@/integrations/supabase/client";

export type PostCategory = "announcement" | "activity" | "success";

export type SitePost = {
  id: string;
  category: PostCategory;
  title: string;
  body: string | null;
  image_path: string | null;
  event_date: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  image_url?: string | null;
};

export const categoryLabels: Record<PostCategory, string> = {
  announcement: "Ανακοίνωση",
  activity: "Δράση",
  success: "Επιτυχία μαθητή",
};

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Attach viewable image URLs to posts (bucket is private, so we sign them). */
async function withImageUrls(posts: SitePost[]): Promise<SitePost[]> {
  const paths = posts.map((p) => p.image_path).filter((p): p is string => !!p);
  if (paths.length === 0) return posts;
  const { data } = await supabase.storage.from("site-media").createSignedUrls(paths, ONE_YEAR);
  const map = new Map((data ?? []).map((d) => [d.path ?? "", d.signedUrl]));
  return posts.map((p) => ({ ...p, image_url: (p.image_path && map.get(p.image_path)) || null }));
}

export async function fetchPublishedPosts(): Promise<SitePost[]> {
  const { data, error } = await supabase
    .from("site_posts")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return withImageUrls((data ?? []) as SitePost[]);
}

export async function fetchAllPosts(): Promise<SitePost[]> {
  const { data, error } = await supabase
    .from("site_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return withImageUrls((data ?? []) as SitePost[]);
}

export function formatDate(value: string | null): string {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("el-GR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export async function uploadMedia(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export async function deleteMedia(path: string | null): Promise<void> {
  if (!path) return;
  await supabase.storage.from("site-media").remove([path]);
}

/** Swap sort_order between two posts so the admin can reorder the public list. */
export async function swapOrder(a: SitePost, b: SitePost): Promise<void> {
  const aOrder = a.sort_order ?? 0;
  const bOrder = b.sort_order ?? 0;
  const next = aOrder === bOrder ? { a: bOrder + 1, b: bOrder } : { a: bOrder, b: aOrder };
  const first = await supabase.from("site_posts").update({ sort_order: next.a }).eq("id", a.id);
  if (first.error) throw first.error;
  const second = await supabase.from("site_posts").update({ sort_order: next.b }).eq("id", b.id);
  if (second.error) throw second.error;
}

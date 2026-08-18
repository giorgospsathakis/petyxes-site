# Οδηγίες μεταφοράς της σελίδας στο δικό σου Supabase / Vercel

> Στόχος: Να τρέχει η δημόσια σελίδα του φροντιστηρίου (`/`) και το CMS (`/admin/landing`) από το δικό σου Supabase project και Vercel account, χωρίς εξάρτηση από Lovable.
> Υποθέτουμε ότι έχεις ήδη ξεχωριστό Supabase project για την εφαργή και θέλεις να φτιάξεις **νέο** project για τη σελίδα.

---

## 1. Δημιουργία νέου Supabase project

1. Πήγαινε στο [supabase.com](https://supabase.com) και συνδέσου.
2. New project → Organization, name (π.χ. `petyxes-site`), password, region.
3. **Region**: προτίμησε **Frankfurt (eu-central-1)** για χρήστες από Ελλάδα.
4. Πάτησε **Create new project** και περίμενε ~2 λεπτά.
5. Μόλις ετοιμαστεί, πήγαινε στο **Project Settings → API**.
6. Κράτησε σε ασφαλές σημείο:
   - **Project URL** (π.χ. `https://xxxxxxxx.supabase.co`)
   - **anon / public key** (π.χ. `eyJ...`)
   - **service_role key** (αυτό θα το βάλεις μόνο στο Vercel, ποτέ στο frontend)

---

## 2. Φτιάξε το Storage bucket

1. Supabase dashboard → **Storage**.
2. **New bucket**.
3. Name: `site-media` (ακριβώς αυτό, με παύλα).
4. Toggle **Public bucket** → **OFF** (θέλουμε private + RLS).
5. **Save**.
6. Αμέσως μετά, πήγαινε **Policies** → κάνε κλικ στο `site-media` bucket και σβήσε όποιο default policy υπάρχει (αν υπάρχει). Τα σωστά policies θα μπουν από το SQL παρακάτω.

---

## 3. Τρέξε το SQL setup

1. Supabase dashboard → **SQL Editor**.
2. **New query**.
3. Ανέβασε / επικόλλησε ολόκληρο το περιεχόμενο του αρχείου `supabase-setup-site.sql`.
4. **Run**.

Το SQL δημιουργεί:
- Τον enum τύπο `app_role`.
- Πίνακα `user_roles`.
- Security definer function `has_role`.
- Πίνακα `site_posts`.
- RLS policies για `site_posts`.
- Storage policies για `site-media`.

Αν όλα πάνε καλά, δεν θα δεις κόκκινα μηνύματα.

---

## 4. Φτιάξε τον admin χρήστη

1. Supabase dashboard → **Authentication** → **Users**.
2. **Add user** ή **Invite user**.
3. Βάλε το email σου και έναν κωδικό (ή στείλε invite στο email σου).
4. Πάτησε **Create user**.
5. Ανέτρεξε το **UUID** του χρήστη (κάνε κλικ στον χρήστη για να το δεις).
6. Πήγαινε ξανά στο **SQL Editor** και τρέξε:

```sql
insert into public.user_roles (user_id, role)
values ('ΤΟ_UUID_ΣΟΥ_ΕΔΩ', 'admin');
```

Αντικατάστησε το `ΤΟ_UUID_ΣΟΥ_ΕΔΩ` με το πραγματικό UUID.

7. Πήγαινε **Authentication → Providers → Email**. Βεβαιώσου ότι είναι ενεργοποιημένο.
8. Πήγαινε **Authentication → Sign In / Up** και **απενεργοποίησε το «Enable new sign ups»** για να μην μπορεί κανείς άλλος να φτιάξει λογαριασμό.

---

## 5. Εξαγωγή κώδικα από Lovable

1. Μπες στο Lovable project → κάνε publish αν δεν είναι ήδη published.
2. Πήγαινε **Settings → GitHub** και συνέδεσε GitHub account.
3. **Push to GitHub** / **Export to GitHub** → δημιούργησε νέο repo (π.χ. `petyxes-site`).
4. Θα πάρεις το URL του repo (π.χ. `https://github.com/USERNAME/petyxes-site`).

---

## 6. Σύνδεση με Vercel

1. Πήγαινε στο [vercel.com](https://vercel.com) και συνδέσου.
2. **Add New Project** → Import το GitHub repo που μόλις φτιάχτηκε.
3. Στο βήμα **Configure Project**:
   - Framework Preset: **Vite**
   - Build Command: `bun run build`
   - Output Directory: `dist`
   - Root Directory: `./`
4. Πρόσθεσε Environment Variables (πάτα **Add** για κάθε μία):

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | Το Project URL από βήμα 1 |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Το anon/public key από βήμα 1 |

> **Σημαντικό:** Το `VITE_SUPABASE_*` prefix είναι απαραίτητο γιατί ο κώδικας το ψάχνει με αυτό το όνομα.

5. **Deploy**.

---

## 7. Έλεγχος

1. Μόλις τελειώσει το deploy, άνοιξε το URL του Vercel.
2. Θα δεις τη δημόσια σελίδα του φροντιστηρίου.
3. Για να δοκιμάσεις το CMS, πήγαινε στο `/admin/landing`.
4. Συνδέσου με το email/κωδικό που έφτιαξες στο βήμα 4.
5. Φτιάξε μια δοκιμαστική ανακοίνωση και δες αν εμφανίζεται στη δημόσια σελίδα.

---

## 8. Σύνδεση προσαρμοσμένου domain (προαιρετικό)

1. Vercel dashboard → το project → **Settings → Domains**.
2. Πρόσθεσε το domain σου (π.χ. `www.petyxes.gr`).
3. Ακολούθησε τις οδηγίες DNS που θα σου δώσει το Vercel.
4. Για το Supabase, δεν χρειάζεται κάτι επιπλέον.

---

## 9. Τι χρειάζεσαι για μελλοντικές αλλαγές περιεχομένου

Μετά τη μεταφορά:
- Μπορείς μόνος σου να γράφεις ανακοινώσεις, δράσεις, επιτυχίες και να ανεβάζεις φωτογραφίες μέσω `/admin/landing`.
- Δεν χρειάζεσαι Lovable για αυτό.
- Για αλλαγές στον κώδικα, το design ή νέα features, θα χρειαστείς πρόσβαση στον κώδικα (GitHub) ή κάποιον developer.

---

## Συχνά προβλήματα

**«Bucket not found» ή storage error**
- Βεβαιώσου ότι το bucket λέγεται ακριβώς `site-media` και είναι private.
- Βεβαιώσου ότι τρέχεις το SQL setup.

**«Invalid login credentials» στο /admin/landing**
- Βεβαιώσου ότι έχεις ενεργοποιήσει το Email provider.
- Βεβαιώσου ότι ο χρήστης έχει γίνει επιβεβαιωμένος (confirmed). Αν τον έφτιαξες χειροκίνητα, θα είναι confirmed.
- Βεβαιώσου ότι τρέχεις το query που του δίνει `admin` role.

**«Permission denied» ή δεν εμφανίζονται posts**
- Βεβαιώσου ότι έχεις τρέξει ολόκληρο το SQL setup, συμπεριλαμβανομένων των `GRANT` και `POLICY`.

**«Missing Supabase environment variable(s)»**
- Βεβαιώσου ότι τα env vars στο Vercel ξεκινούν με `VITE_SUPABASE_` και έχεις κάνει redeploy.

import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { siteUrl } from "@/lib/site-url";

export const Route = createFileRoute("/epikoinonia")({
  head: () => ({
    meta: [
      { title: "Επικοινωνία — Πέτυχες! Κέντρο Μελέτης" },
      {
        name: "description",
        content:
          "Επικοινωνήστε με το φροντιστήριο «Πέτυχες!» για τμήματα, πρόγραμμα και εγγραφές. Τηλέφωνο, email, διεύθυνση και ώρες λειτουργίας.",
      },
      { property: "og:title", content: "Επικοινωνία — Πέτυχες!" },
      { property: "og:description", content: "Τηλέφωνο, email, διεύθυνση και ώρες λειτουργίας του φροντιστηρίου." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: siteUrl("/epikoinonia") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: siteUrl("/epikoinonia") }],
  }),
  component: ContactPage,
});
 const details = [
  { icon: MapPin, label: "Διεύθυνση", value: "Πύργος Μονοφατσίου, Τ.Κ. 70010" },
  { icon: Phone, label: "Τηλέφωνο", value: "289 302 2032 / 698 835 1017" },
  { icon: Mail, label: "Email", value: "petyxesfront@gmail.com" },
];
function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl">Επικοινωνία</h1>
              <p className="text-lg text-muted-foreground">
                Θέλετε να μάθετε περισσότερα για τα τμήματα και το πρόγραμμα; Επικοινωνήστε μαζί μας.
              </p>
            </div>
            <div className="space-y-5">
              {details.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.label} className="flex items-center gap-4">
                    <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-bold text-foreground">{d.label}</div>
                      <div className="text-sm text-muted-foreground">{d.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-border bg-card p-8 shadow-sm md:p-10">
            <h2 className="mb-6 text-xl font-bold text-foreground">Ώρες λειτουργίας</h2>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex justify-between border-b border-border pb-3">
                <span>Δευτέρα — Παρασκευή</span>
                <span className="font-bold text-foreground">15:00 — 21:00</span>
              </li>
              <li className="flex justify-between border-b border-border pb-3">
                <span>Σάββατο</span>
                <span className="font-bold text-foreground">10:00 — 14:00</span>
              </li>
              <li className="flex justify-between pt-1">
                <span>Κυριακή</span>
                <span className="font-bold text-foreground">Κλειστά</span>
              </li>
            </ul>
            <div className="mt-8 rounded-2xl bg-secondary p-5 text-center text-sm text-muted-foreground">
              Θέλετε να προσαρμόσουμε τα στοιχεία επικοινωνίας και τις ώρες; Πείτε μας τι να γράψουμε.
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

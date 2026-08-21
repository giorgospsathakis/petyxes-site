import {
  BookOpen,
  CalendarDays,
  Home,
  Lightbulb,
  MapPin,
  Phone,
  Presentation,
  School,
  Sparkles,
  Users,
} from "lucide-react";

import heroStudy from "@/assets/hero-study.jpg";
import serviceClassroom from "@/assets/service-classroom.jpg";
import serviceStudy from "@/assets/service-study.jpg";
import serviceTutoring from "@/assets/service-tutoring.jpg";
import serviceCounseling from "@/assets/service-counseling.jpg";import serviceCommunication from "@/assets/service-communication.jpg";import serviceExams from "@/assets/service-exams.jpg";
import activityExcursion from "@/assets/activity-excursion.jpg";
import activityWorkshop from "@/assets/activity-workshop.jpg";
import activityParents from "@/assets/activity-parents.jpg";

export const offerings = [
  {
    icon: BookOpen,
    title: "Φροντιστηριακά μαθήματα",
    text: "Οργανωμένα τμήματα σε όλα τα μαθήματα Γυμνασίου και Λυκείου με έμπειρους καθηγητές.",
    image: serviceClassroom,
  },
   {
    icon: School,
    title: "Καθημερινή μελέτη Δημοτικού",
    text: "Φιλικό περιβάλλον μελέτης με επίβλεψη, για παιδιά Δημοτικού, ώστε κάθε μαθητής να αξιοποιεί τον χρόνο του αποδοτικά.",
    image: serviceStudy,
  },
  {
    icon: Lightbulb,
    title: "Ενισχυτική διδασκαλία",
    text: "Προσωποποιημένη υποστήριξη σε αδύναμα σημεία, μικρά τμήματα και άμεση ανατροφοδότηση.",
    image: serviceTutoring,
  },
  {
    icon: Presentation,
    title: "Προσομοιώσεις & διαγωνίσματα",
    text: "Τακτικές προσομοιώσεις, συμμετοχή στα διαγωνίσματα ΟΕΦΕ — ΕΙΜΑΣΤΕ ΜΕΣΑ!, αναλυτική βαθμολόγηση και στοχευμένη προετοιμασία για εξετάσεις.",
    image: serviceExams,
  },
  {
    icon: Users,
    title: "Συμβουλευτική προσανατολισμού",
    text: "Συζητήσεις με μαθητές και γονείς για στόχους, τρόπους μελέτης και επιλογές σπουδών.",
    image: serviceCounseling,
  },
  {
    icon: Phone,
    title: "Επικοινωνία με γονείς",
    text: "Τακτική ενημέρωση για πρόοδο, παρουσίες και θέματα συμπεριφοράς, με διαφάνεια και εμπιστοσύνη.",
    image: serviceCommunication,
  },
];

export const activities = [
  {
    image: activityExcursion,
    icon: MapPin,
    title: "Εκπαιδευτικές εξορμήσεις",
    text: "Επισκέψεις σε μουσεία, εργαστήρια και χώρους πολιτισμού που συνδυάζουν τη γνώση με την εμπειρία.",
  },
  {
    image: activityWorkshop,
    icon: Sparkles,
    title: "Εργαστήρια δεξιοτήτων",
    text: "Δημιουργικές ομάδες για ρητορική, ομαδική συνεργασία, κριτική σκέψη και ψηφιακές δεξιότητες.",
  },
  {
    image: activityParents,
    icon: CalendarDays,
    title: "Ομιλίες και ημερίδες",
    text: "Συναντήσεις με ειδικούς για σπουδές, επαγγέλματα, ψυχική υγεία και ακαδημαϊκές επιλογές.",
  },
  {
    image: heroStudy,
    icon: Home,
    title: "Ανοιχτές εκδηλώσεις γονέων",
    text: "Ενημερωτικές βραδιές, συζητήσεις και ανταλλαγή απόψεων για την πρόοδο και τη στήριξη των παιδιών.",
  },
];

export const courseGroups = [
  {
    title: "Δημοτικό",
    subjects: ["Γλώσσα", "Μαθηματικά", "Μελέτη Περιβάλλοντος", "Αγγλικά"],
    text: "Καθημερινή υποστήριξη στα μαθήματα, εμπέδωση της ύλης και καλλιέργεια σωστών συνηθειών μελέτης από μικρή ηλικία.",
  },
  {
    title: "Γυμνάσιο",
    subjects: ["Μαθηματικά", "Φυσική — Χημεία", "Αρχαία & Νέα Ελληνικά", "Ιστορία"],
    text: "Σταθερές βάσεις, μεθοδική μελέτη και συνέπεια στην καθημερινή προετοιμασία.",
  },
  {
    title: "Α΄ Λυκείου",
    subjects: ["Άλγεβρα & Γεωμετρία", "Φυσική — Χημεία", "Έκθεση — Λογοτεχνία", "Αρχαία"],
    text: "Ενίσχυση σε όλα τα μαθήματα και έγκαιρη εξοικείωση με τον προσανατολισμό.",
  },
  {
    title: "Β΄ & Γ΄ Λυκείου — Πανελλαδικές",
    subjects: ["Θετικές Σπουδές", "Σπουδές Υγείας", "Ανθρωπιστικές Σπουδές", "Οικονομία & Πληροφορική"],
    text: "Εντατική προετοιμασία, εβδομαδιαία διαγωνίσματα και συνεχής αξιολόγηση προόδου.",
  },
];

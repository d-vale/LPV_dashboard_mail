export const CATEGORIES = [
  { label: "Prescription médicale", color: "#449850" },
  { label: "Rapport médical", color: "#2563EB" },
  { label: "Demande de thérapie", color: "#8B5CF6" },
  { label: "Facture", color: "#F59E0B" },
  { label: "Demande administrative", color: "#10B981" },
  { label: "Urgence médicale", color: "#DC2626" },
  { label: "Non pertinent / Spam", color: "#6B7280" },
] as const;

export const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.label, c.color])
);

export const MAILBOXES = [
  "Prescriptions",
  "Rapports",
  "Thérapies",
  "Facturation",
  "Administration",
  "Urgences",
  "Spam / Non-pertinent",
  "À réviser manuellement",
] as const;

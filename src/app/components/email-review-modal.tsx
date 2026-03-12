import { useState } from "react";
import type { EmailItem } from "../types/email";
import { CATEGORIES, MAILBOXES } from "../constants/categories";
import {
  X,
  Mail,
  Paperclip,
  Brain,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Send,
  ThumbsUp,
  Zap,
  ShieldCheck,
} from "lucide-react";

interface EmailReviewModalProps {
  email: EmailItem;
  onClose: () => void;
  onCorrect: (emailId: string, newCategory: string, newDestination: string, reason: string) => void;
  onValidate: (emailId: string) => void;
}

/* ─── Static data ─────────────────────────────────────── */
const MOCK_BODIES: Record<string, string> = {
  "EM-2026-0341": "Bonjour,\n\nVeuillez trouver ci-joint la prescription CPAP pour le patient référencé 4521. Le traitement débute le 15 mars 2026 avec un débit de 8 L/min.\n\nCordialement,\nDr. Müller — CHUV, Service de Pneumologie",
  "EM-2026-0340": "Madame, Monsieur,\n\nNous vous faisons parvenir le rapport de polysomnographie de M. Dupont effectué le 08.03.2026. Les résultats indiquent un IAH de 28/h confirmant un SAOS modéré.\n\nL'équipe soignante de l'Hôpital de Morges",
  "EM-2026-0339": "Bonjour,\n\nSuite à notre consultation du 10 mars, je souhaiterais renouveler la prescription d'oxygène pour notre patient commun. Veuillez trouver le formulaire en pièce jointe.\n\nDr. Rochat",
  "EM-2026-0338": "Madame, Monsieur,\n\nVous trouverez ci-après la facture n°2026-1847 relative à la prise en charge du 01.03.2026 pour un montant de CHF 284.50. Délai de paiement : 30 jours.\n\nCSS Assurance — Service facturation",
  "EM-2026-0337": "Bonjour,\n\nJe souhaiterais prendre rendez-vous pour un contrôle de mon appareil CPAP. Suis-je disponible en semaine de 14h à 18h.\n\nCordialement, M. Martin",
  "EM-2026-0336": "Bonjour,\n\nJe vous contacte au sujet du patient Ref 8834, suivi pour apnée du sommeil sévère. Une thérapie respiratoire nocturne est envisagée. Pourriez-vous me faire parvenir les informations nécessaires ?\n\nDr. Favre — Pneumologie",
  "EM-2026-0335": "Votre facture mensuelle Swisscom pour le mois de février 2026 est disponible. Montant : CHF 79.90. Téléchargez votre facture depuis votre espace client.",
};

const MOCK_AI_REASONS: Record<string, string> = {
  "EM-2026-0341": "Mots-clés détectés : « prescription », « CPAP », « débit ». Expéditeur identifié comme domaine médical vérifié (@chuv.ch). Pièce jointe PDF présente.",
  "EM-2026-0340": "Mots-clés : « rapport », « polysomnographie », « IAH ». Structure typique d'un rapport médical. Expéditeur hospitalier reconnu.",
  "EM-2026-0339": "Mots-clés : « prescription », « oxygène ». Précision réduite car le terme « renouvellement » introduit une ambiguïté avec les demandes administratives.",
  "EM-2026-0338": "Mots-clés : « facture », « prise en charge », « CHF ». Domaine expéditeur identifié comme assurance (@css.ch).",
  "EM-2026-0337": "Mots-clés : « rendez-vous », « contrôle ». Email provenant d'un patient (domaine gmail). Classifié comme demande administrative.",
  "EM-2026-0336": "Mots-clés : « thérapie respiratoire ». Précision réduite car la demande pourrait également être traitée comme une prescription selon le contexte clinique.",
  "EM-2026-0335": "Aucun mot-clé médical détecté. Domaine @swisscom.ch non médical. Classification incertaine entre facture et spam.",
};

/* ─── Confidence bar ─────────────────────────────────── */
function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 90 ? "#48C970" : value >= 70 ? "#F59E0B" : "#F87171";
  const label = value >= 90 ? "Haute précision" : value >= 70 ? "Précision modérée" : "Faible précision";
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[12px]" style={{ color: "rgba(212,240,227,0.50)" }}>{label}</span>
        <span
          className="text-[14px]"
          style={{ color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}
        >
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(212,240,227,0.06)" }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}60` }}
        />
      </div>
    </div>
  );
}

/* ─── Main Modal ─────────────────────────────────────── */
export function EmailReviewModal({ email, onClose, onCorrect, onValidate }: EmailReviewModalProps) {
  const isPending = email.status === "pending";
  const isError = email.status === "error";
  const needsAction = isPending || isError;

  const [mode, setMode] = useState<"view" | "correct">("view");
  const [selectedCategory, setSelectedCategory] = useState(email.category);
  const [selectedMailbox, setSelectedMailbox] = useState(
    email.destination === "En attente de validation" || email.destination === "Non classifie"
      ? MAILBOXES[0]
      : email.destination.replace("Sous-boite ", "")
  );
  const [correctionReason, setCorrectionReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const body = MOCK_BODIES[email.id] ?? "Corps de l'email non disponible.";
  const aiReason = MOCK_AI_REASONS[email.id] ?? "Analyse basée sur les mots-clés et le contexte.";

  const handleValidate = () => {
    onValidate(email.id);
    setSubmitted(true);
    setTimeout(onClose, 1400);
  };

  const handleCorrect = () => {
    if (!correctionReason.trim() && mode === "correct") return;
    onCorrect(email.id, selectedCategory, selectedMailbox, correctionReason);
    setSubmitted(true);
    setTimeout(onClose, 1600);
  };

  const handleDownloadAttachment = () => {
    const blob = new Blob(
      [`Document: ${email.subject}\nID: ${email.id}\nDate: 12 mars 2026\n\n${body}`],
      { type: "application/pdf" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `document.${email.attachmentType?.toLowerCase() || "pdf"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.label === selectedCategory) ?? CATEGORIES[0];

  const modalStyle = {
    background: "rgba(0, 22, 21, 0.98)",
    border: "1px solid rgba(212, 240, 227, 0.10)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  };

  const inputStyle = {
    background: "rgba(0, 56, 51, 0.40)",
    border: "1px solid rgba(212,240,227,0.10)",
    color: "#F0FFF8",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "12px",
    width: "100%",
    outline: "none",
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(0,8,8,0.80)", backdropFilter: "blur(6px)" }}
    >
      <div className="rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col" style={modalStyle}>

        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid rgba(212,240,227,0.06)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(212,240,227,0.06)", border: "1px solid rgba(212,240,227,0.08)" }}
            >
              <Mail size={17} style={{ color: "rgba(212,240,227,0.50)" }} />
            </div>
            <div>
              <p
                className="text-[14px]"
                style={{ fontWeight: 600, color: "#F0FFF8", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {email.id}
              </p>
              <p className="text-[11px]" style={{ color: "rgba(212,240,227,0.35)", fontFamily: "'JetBrains Mono', monospace" }}>
                {email.time} — info@lpvd.ch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors"
            style={{ background: "rgba(212,240,227,0.05)", color: "rgba(212,240,227,0.50)" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Pending banner */}
        {needsAction && !submitted && (
          <div
            className="px-6 py-3 flex items-center gap-3 shrink-0"
            style={{
              background: isPending ? "rgba(245,158,11,0.08)" : "rgba(227,6,19,0.08)",
              borderBottom: isPending ? "1px solid rgba(245,158,11,0.15)" : "1px solid rgba(227,6,19,0.15)",
            }}
          >
            <AlertTriangle size={15} style={{ color: isPending ? "#F59E0B" : "#F87171" }} />
            <div className="flex-1">
              <p className="text-[12px]" style={{ fontWeight: 600, color: isPending ? "#F59E0B" : "#F87171" }}>
                {isPending
                  ? "Le système n'est pas suffisamment sûr — votre validation est requise"
                  : "Classification incertaine — vérification manuelle nécessaire"}
              </p>
              <p className="text-[11px]" style={{ color: isPending ? "rgba(245,158,11,0.70)" : "rgba(248,113,113,0.70)" }}>
                Votre décision sera enregistrée pour améliorer les prochaines classifications.
              </p>
            </div>
            <span
              className="text-[12px] px-2 py-1 rounded-full"
              style={{
                background: isPending ? "rgba(245,158,11,0.12)" : "rgba(227,6,19,0.12)",
                color: isPending ? "#F59E0B" : "#F87171",
                fontWeight: 600,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {email.confidence.toFixed(1)}%
            </span>
          </div>
        )}

        {/* Submitted feedback */}
        {submitted && (
          <div
            className="px-6 py-3 flex items-center gap-3 shrink-0"
            style={{ background: "rgba(4,135,64,0.08)", borderBottom: "1px solid rgba(4,135,64,0.15)" }}
          >
            <Sparkles size={15} style={{ color: "#48C970" }} />
            <p className="text-[12px]" style={{ fontWeight: 600, color: "#48C970" }}>
              ✓ Correction enregistrée — le système s'améliorera grâce à vos retours
            </p>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 h-full">

            {/* Left — Email content */}
            <div className="lg:col-span-3 p-6" style={{ borderRight: "1px solid rgba(212,240,227,0.06)" }}>
              <div className="mb-4">
                <h2 className="text-[16px] mb-3" style={{ fontWeight: 600, color: "#F0FFF8" }}>
                  {email.subject}
                </h2>
                <div className="space-y-1.5">
                  {[
                    { label: "De :", value: email.from },
                    { label: "À :", value: "info@lpvd.ch" },
                    { label: "Date :", value: `12 mars 2026, ${email.time}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-2 text-[12px]">
                      <span className="w-14 shrink-0" style={{ color: "rgba(212,240,227,0.35)" }}>{label}</span>
                      <span style={{ color: "#F0FFF8", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attachment */}
              {email.hasAttachment && (
                <div
                  className="flex items-center gap-2 mb-4 rounded-xl px-3 py-2.5 w-fit"
                  style={{ background: "rgba(0,56,51,0.50)", border: "1px solid rgba(212,240,227,0.08)" }}
                >
                  <Paperclip size={13} style={{ color: "rgba(212,240,227,0.50)" }} />
                  <span className="text-[12px]" style={{ fontWeight: 500, color: "#F0FFF8", fontFamily: "'JetBrains Mono', monospace" }}>
                    document.{email.attachmentType?.toLowerCase()}
                  </span>
                  <span className="text-[10px]" style={{ color: "rgba(212,240,227,0.35)" }}>234 KB</span>
                  <button
                    onClick={handleDownloadAttachment}
                    className="ml-2 text-[10px] transition-colors"
                    style={{ color: "#48C970" }}
                  >
                    Télécharger
                  </button>
                </div>
              )}

              {/* Body */}
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(0,56,51,0.30)", border: "1px solid rgba(212,240,227,0.06)" }}
              >
                <pre
                  className="text-[12px] whitespace-pre-wrap font-sans leading-relaxed"
                  style={{ color: "rgba(212,240,227,0.65)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {body}
                </pre>
              </div>
            </div>

            {/* Right — AI analysis + actions */}
            <div className="lg:col-span-2 p-6 flex flex-col gap-5">

              {/* Current classification */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={14} style={{ color: "#A78BFA" }} />
                  <span
                    className="text-[12px] uppercase tracking-wider"
                    style={{ fontWeight: 600, color: "rgba(212,240,227,0.40)" }}
                  >
                    Analyse automatique
                  </span>
                </div>

                <div
                  className="rounded-xl p-4 space-y-3"
                  style={{ background: "rgba(0,56,51,0.30)", border: "1px solid rgba(212,240,227,0.06)" }}
                >
                  <div>
                    <p className="text-[11px] mb-1" style={{ color: "rgba(212,240,227,0.40)" }}>Catégorie détectée</p>
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] text-white"
                      style={{ backgroundColor: email.categoryColor, fontWeight: 500 }}
                    >
                      {email.category}
                    </span>
                  </div>
                  <ConfidenceBar value={email.confidence} />
                  <div>
                    <p className="text-[11px] mb-1" style={{ color: "rgba(212,240,227,0.40)" }}>Destination proposée</p>
                    <div className="flex items-center gap-1.5">
                      <ArrowRight size={11} style={{ color: "#48C970" }} />
                      <span className="text-[12px]" style={{ fontWeight: 500, color: "#48C970" }}>
                        {email.destination}
                      </span>
                    </div>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(212,240,227,0.06)", paddingTop: 12 }}>
                    <p className="text-[11px] mb-1.5 flex items-center gap-1" style={{ color: "rgba(212,240,227,0.40)" }}>
                      <Zap size={10} style={{ color: "#A78BFA" }} />
                      Raisonnement de l'algorithme
                    </p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(212,240,227,0.55)" }}>{aiReason}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!submitted && mode === "view" && (
                <div className="space-y-2.5 mt-auto">
                  {needsAction && (
                    <button
                      onClick={handleValidate}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] transition-all"
                      style={{
                        background: "rgba(4,135,64,0.20)",
                        border: "1px solid rgba(4,135,64,0.35)",
                        color: "#48C970",
                        fontWeight: 600,
                        boxShadow: "0 0 20px rgba(4,135,64,0.12)",
                      }}
                    >
                      <ThumbsUp size={15} />
                      Confirmer cette classification
                    </button>
                  )}
                  <button
                    onClick={() => setMode("correct")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] transition-all"
                    style={{
                      background: "rgba(212,240,227,0.04)",
                      border: needsAction
                        ? "1px solid rgba(212,240,227,0.10)"
                        : "1px solid rgba(4,135,64,0.25)",
                      color: needsAction ? "rgba(212,240,227,0.70)" : "#48C970",
                      fontWeight: 500,
                    }}
                  >
                    <RotateCcw size={15} />
                    {needsAction ? "Non, corriger le tri" : "Corriger le tri"}
                  </button>
                  {!needsAction && (
                    <p className="text-[11px] text-center" style={{ color: "rgba(212,240,227,0.30)" }}>
                      Ce mail a été classifié automatiquement.
                    </p>
                  )}
                </div>
              )}

              {/* Correction form */}
              {!submitted && mode === "correct" && (
                <div className="space-y-4 mt-auto">
                  <div
                    className="rounded-xl px-4 py-3"
                    style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)" }}
                  >
                    <p className="text-[12px]" style={{ fontWeight: 600, color: "#A78BFA" }}>Corriger & apprendre</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "rgba(167,139,250,0.70)" }}>
                      Votre correction sera utilisée pour affiner l'algorithme.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[12px] mb-1.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.55)" }}>
                      Bonne catégorie
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        style={{ ...inputStyle, appearance: "none" }}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.label} value={c.label} style={{ background: "#002B29" }}>{c.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(212,240,227,0.35)" }} />
                    </div>
                    {selectedCategory !== email.category && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] text-white" style={{ backgroundColor: email.categoryColor, fontWeight: 500 }}>
                          {email.category}
                        </span>
                        <ArrowRight size={10} style={{ color: "rgba(212,240,227,0.30)" }} />
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] text-white" style={{ backgroundColor: selectedCategoryObj.color, fontWeight: 500 }}>
                          {selectedCategory}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[12px] mb-1.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.55)" }}>
                      Envoyer dans la boîte
                    </label>
                    <div className="relative">
                      <select
                        value={selectedMailbox}
                        onChange={(e) => setSelectedMailbox(e.target.value)}
                        style={{ ...inputStyle, appearance: "none" }}
                      >
                        {MAILBOXES.map((mb) => (
                          <option key={mb} value={mb} style={{ background: "#002B29" }}>📂 {mb}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(212,240,227,0.35)" }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] mb-1.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.55)" }}>
                      Raison de la correction
                    </label>
                    <textarea
                      value={correctionReason}
                      onChange={(e) => setCorrectionReason(e.target.value)}
                      placeholder="ex. Cet email contient une facture mais aussi une demande de thérapie…"
                      rows={3}
                      style={{ ...inputStyle, resize: "none" }}
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setMode("view")}
                      className="flex-1 py-2.5 rounded-xl text-[12px] transition-colors"
                      style={{ background: "rgba(212,240,227,0.05)", border: "1px solid rgba(212,240,227,0.08)", color: "rgba(212,240,227,0.55)" }}
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCorrect}
                      disabled={!correctionReason.trim()}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] transition-all"
                      style={{
                        background: "rgba(4,135,64,0.20)",
                        border: "1px solid rgba(4,135,64,0.30)",
                        color: "#48C970",
                        fontWeight: 600,
                        opacity: !correctionReason.trim() ? 0.4 : 1,
                        cursor: !correctionReason.trim() ? "not-allowed" : "pointer",
                      }}
                    >
                      <Send size={13} />
                      Enregistrer la correction
                    </button>
                  </div>
                </div>
              )}

              {/* Submitted state */}
              {submitted && (
                <div
                  className="mt-auto rounded-xl p-4 text-center space-y-2"
                  style={{ background: "rgba(4,135,64,0.08)", border: "1px solid rgba(4,135,64,0.15)" }}
                >
                  <ShieldCheck size={24} className="mx-auto" style={{ color: "#48C970", filter: "drop-shadow(0 0 8px rgba(72,201,112,0.50))" }} />
                  <p className="text-[13px]" style={{ fontWeight: 600, color: "#48C970" }}>
                    Merci pour votre retour !
                  </p>
                  <p className="text-[11px]" style={{ color: "rgba(212,240,227,0.45)" }}>
                    L'algorithme intégrera cette correction lors de sa prochaine mise à jour.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

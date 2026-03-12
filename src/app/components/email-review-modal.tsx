import { useState } from "react";
import type { EmailItem } from "../types/email";
import { CATEGORIES, MAILBOXES } from "../constants/categories";
import {
  X,
  Mail,
  Paperclip,
  Brain,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Send,
  ThumbsUp,
  ThumbsDown,
  Clock,
  User,
  Zap,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

interface EmailReviewModalProps {
  email: EmailItem;
  onClose: () => void;
  onCorrect: (emailId: string, newCategory: string, newDestination: string, reason: string) => void;
  onValidate: (emailId: string) => void;
}

/* ─── Static data ────────────────────────────────────── */
const MOCK_BODIES: Record<string, string> = {
  "EM-2026-0341":
    "Bonjour,\n\nVeuillez trouver ci-joint la prescription CPAP pour le patient référencé 4521. Le traitement débute le 15 mars 2026 avec un débit de 8 L/min.\n\nCordialement,\nDr. Müller — CHUV, Service de Pneumologie",
  "EM-2026-0340":
    "Madame, Monsieur,\n\nNous vous faisons parvenir le rapport de polysomnographie de M. Dupont effectué le 08.03.2026. Les résultats indiquent un IAH de 28/h confirmant un SAOS modéré.\n\nL'équipe soignante de l'Hôpital de Morges",
  "EM-2026-0339":
    "Bonjour,\n\nSuite à notre consultation du 10 mars, je souhaiterais renouveler la prescription d'oxygène pour notre patient commun. Veuillez trouver le formulaire en pièce jointe.\n\nDr. Rochat",
  "EM-2026-0338":
    "Madame, Monsieur,\n\nVous trouverez ci-après la facture n°2026-1847 relative à la prise en charge du 01.03.2026 pour un montant de CHF 284.50. Délai de paiement : 30 jours.\n\nCSS Assurance — Service facturation",
  "EM-2026-0337":
    "Bonjour,\n\nJe souhaiterais prendre rendez-vous pour un contrôle de mon appareil CPAP. Suis-je disponible en semaine de 14h à 18h.\n\nCordialement, M. Martin",
  "EM-2026-0336":
    "Bonjour,\n\nJe vous contacte au sujet du patient Ref 8834, suivi pour apnée du sommeil sévère. Une thérapie respiratoire nocturne est envisagée. Pourriez-vous me faire parvenir les informations nécessaires ?\n\nDr. Favre — Pneumologie",
  "EM-2026-0335":
    "Votre facture mensuelle Swisscom pour le mois de février 2026 est disponible. Montant : CHF 79.90. Téléchargez votre facture depuis votre espace client.",
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
  const color = value >= 90 ? "#449850" : value >= 70 ? "#F59E0B" : "#DC2626";
  const label = value >= 90 ? "Haute précision" : value >= 70 ? "Précision modérée" : "Faible précision";
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[12px] text-[#6B7280]">{label}</span>
        <span className="text-[14px]" style={{ color, fontWeight: 700 }}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
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

  const [mode, setMode] = useState<"view" | "correct">(needsAction ? "view" : "view");
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
    // Create a mock PDF blob for demonstration
    const blob = new Blob(
      [`Document: ${email.subject}\nID: ${email.id}\nDate: 11 mars 2026\n\n${body}`],
      { type: 'application/pdf' }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document.${email.attachmentType?.toLowerCase() || 'pdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const selectedCategoryObj = CATEGORIES.find((c) => c.label === selectedCategory) ?? CATEGORIES[0];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
              <Mail size={17} className="text-[#6B7280]" />
            </div>
            <div>
              <p className="text-[14px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
                {email.id}
              </p>
              <p className="text-[11px] text-[#9CA3AF]">{email.time} — info@lpvd.ch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#1B1B2F] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Pending banner ── */}
        {needsAction && !submitted && (
          <div className={`px-6 py-3 flex items-center gap-3 shrink-0 ${isPending ? "bg-amber-50 border-b border-amber-100" : "bg-red-50 border-b border-red-100"}`}>
            <AlertTriangle size={15} className={isPending ? "text-amber-500" : "text-red-500"} />
            <div className="flex-1">
              <p className={`text-[12px] ${isPending ? "text-amber-700" : "text-red-700"}`} style={{ fontWeight: 600 }}>
                {isPending
                  ? "Le système n'est pas suffisamment sûr — votre validation est requise"
                  : "Classification incertaine — vérification manuelle nécessaire"}
              </p>
              <p className={`text-[11px] ${isPending ? "text-amber-600" : "text-red-600"}`}>
                Votre décision sera enregistrée pour améliorer les prochaines classifications.
              </p>
            </div>
            <span className={`text-[12px] px-2 py-1 rounded-full ${isPending ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`} style={{ fontWeight: 600 }}>
              Précision : {email.confidence.toFixed(1)}%
            </span>
          </div>
        )}

        {/* ── Submitted feedback ── */}
        {submitted && (
          <div className="px-6 py-3 bg-[#449850]/10 border-b border-[#449850]/20 flex items-center gap-3 shrink-0">
            <Sparkles size={15} className="text-[#449850]" />
            <p className="text-[12px] text-[#449850]" style={{ fontWeight: 600 }}>
              ✓ Correction enregistrée — le système s'améliorera grâce à vos retours
            </p>
          </div>
        )}

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 h-full">

            {/* Left — Email content */}
            <div className="lg:col-span-3 p-6 border-r border-black/5">
              <div className="mb-4">
                <h2 className="text-[16px] text-[#1B1B2F] mb-3" style={{ fontWeight: 600 }}>
                  {email.subject}
                </h2>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="text-[#9CA3AF] w-14">De :</span>
                    <span className="text-[#1B1B2F]" style={{ fontWeight: 500 }}>{email.from}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="text-[#9CA3AF] w-14">À :</span>
                    <span className="text-[#1B1B2F]">info@lpvd.ch</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12px]">
                    <span className="text-[#9CA3AF] w-14">Date :</span>
                    <span className="text-[#1B1B2F]">11 mars 2026, {email.time}</span>
                  </div>
                </div>
              </div>

              {/* Attachment */}
              {email.hasAttachment && (
                <div className="flex items-center gap-2 mb-4 bg-[#F7F8FA] rounded-xl px-3 py-2.5 w-fit">
                  <Paperclip size={13} className="text-[#6B7280]" />
                  <span className="text-[12px] text-[#1B1B2F]" style={{ fontWeight: 500 }}>
                    document.{email.attachmentType?.toLowerCase()}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF]">234 KB</span>
                  <button
                    onClick={handleDownloadAttachment}
                    className="ml-2 text-[10px] text-[#449850] hover:underline"
                  >
                    Télécharger
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="bg-[#F7F8FA] rounded-xl p-4">
                <pre className="text-[12px] text-[#6B7280] whitespace-pre-wrap font-sans leading-relaxed">
                  {body}
                </pre>
              </div>
            </div>

            {/* Right — AI analysis + actions */}
            <div className="lg:col-span-2 p-6 flex flex-col gap-5">

              {/* Current classification */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Brain size={14} className="text-purple-500" />
                  <span className="text-[12px] text-[#6B7280] uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    Analyse automatique
                  </span>
                </div>

                <div className="bg-[#F7F8FA] rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-[11px] text-[#9CA3AF] mb-1">Catégorie détectée</p>
                    <span
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] text-white"
                      style={{ backgroundColor: email.categoryColor, fontWeight: 500 }}
                    >
                      {email.category}
                    </span>
                  </div>
                  <ConfidenceBar value={email.confidence} />
                  <div>
                    <p className="text-[11px] text-[#9CA3AF] mb-1">Destination proposée</p>
                    <div className="flex items-center gap-1.5">
                      <ArrowRight size={11} className="text-[#449850]" />
                      <span className="text-[12px] text-[#449850]" style={{ fontWeight: 500 }}>
                        {email.destination}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-black/5 pt-3">
                    <p className="text-[11px] text-[#9CA3AF] mb-1.5 flex items-center gap-1">
                      <Zap size={10} className="text-purple-400" />
                      Raisonnement de l'algorithme
                    </p>
                    <p className="text-[11px] text-[#6B7280] leading-relaxed">{aiReason}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {!submitted && mode === "view" && (
                <div className="space-y-2.5 mt-auto">
                  {needsAction && (
                    <button
                      onClick={handleValidate}
                      className="w-full flex items-center justify-center gap-2 bg-[#449850] hover:bg-[#367A40] text-white py-2.5 rounded-xl text-[13px] transition-colors shadow-sm shadow-[#449850]/20"
                      style={{ fontWeight: 600 }}
                    >
                      <ThumbsUp size={15} />
                      Confirmer cette classification
                    </button>
                  )}
                  <button
                    onClick={() => setMode("correct")}
                    className={`w-full flex items-center justify-center gap-2 border py-2.5 rounded-xl text-[13px] transition-colors ${
                      needsAction
                        ? "border-[#E5E7EB] text-[#1B1B2F] hover:bg-[#F7F8FA]"
                        : "border-[#449850]/30 text-[#449850] hover:bg-[#449850]/5"
                    }`}
                    style={{ fontWeight: 500 }}
                  >
                    <RotateCcw size={15} />
                    {needsAction ? "Non, corriger le tri" : "Corriger le tri"}
                  </button>
                  {!needsAction && (
                    <p className="text-[11px] text-[#9CA3AF] text-center">
                      Ce mail a été classifié automatiquement.
                    </p>
                  )}
                </div>
              )}

              {/* Correction form */}
              {!submitted && mode === "correct" && (
                <div className="space-y-4 mt-auto">
                  <div className="bg-purple-50 rounded-xl px-4 py-3">
                    <p className="text-[12px] text-purple-700" style={{ fontWeight: 600 }}>
                      Corriger & apprendre
                    </p>
                    <p className="text-[11px] text-purple-600 mt-0.5">
                      Votre correction sera utilisée pour affiner l'algorithme.
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
                      Bonne catégorie
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] appearance-none bg-white"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.label} value={c.label}>{c.label}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    </div>
                    {selectedCategory !== email.category && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] text-white"
                          style={{ backgroundColor: email.categoryColor, fontWeight: 500 }}
                        >
                          {email.category}
                        </span>
                        <ArrowRight size={10} className="text-[#9CA3AF]" />
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-[10px] text-white"
                          style={{ backgroundColor: selectedCategoryObj.color, fontWeight: 500 }}
                        >
                          {selectedCategory}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Mailbox */}
                  <div>
                    <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
                      Envoyer dans la boîte
                    </label>
                    <div className="relative">
                      <select
                        value={selectedMailbox}
                        onChange={(e) => setSelectedMailbox(e.target.value)}
                        className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] appearance-none bg-white"
                      >
                        {MAILBOXES.map((mb) => (
                          <option key={mb} value={mb}>📂 {mb}</option>
                        ))}
                      </select>
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
                      Raison de la correction <span className="text-[#9CA3AF]">(aide l'algorithme à s'améliorer)</span>
                    </label>
                    <textarea
                      value={correctionReason}
                      onChange={(e) => setCorrectionReason(e.target.value)}
                      placeholder="ex. Cet email contient une facture mais aussi une demande de thérapie, la catégorie principale est thérapie."
                      rows={3}
                      className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] focus:ring-2 focus:ring-[#449850]/10 resize-none transition-all"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setMode("view")}
                      className="flex-1 py-2.5 border border-[#E5E7EB] rounded-xl text-[12px] text-[#6B7280] hover:bg-[#F7F8FA] transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleCorrect}
                      disabled={!correctionReason.trim()}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#449850] hover:bg-[#367A40] disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-[12px] transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      <Send size={13} />
                      Enregistrer la correction
                    </button>
                  </div>
                </div>
              )}

              {/* Submitted state */}
              {submitted && (
                <div className="mt-auto bg-[#449850]/8 border border-[#449850]/20 rounded-xl p-4 text-center space-y-2">
                  <ShieldCheck size={24} className="text-[#449850] mx-auto" />
                  <p className="text-[13px] text-[#449850]" style={{ fontWeight: 600 }}>
                    Merci pour votre retour !
                  </p>
                  <p className="text-[11px] text-[#6B7280]">
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
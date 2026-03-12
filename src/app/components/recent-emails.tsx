import { useState } from "react";
import {
  Mail,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Search,
  ArrowRight,
} from "lucide-react";
import { EmailReviewModal } from "./email-review-modal";
import type { EmailItem } from "../types/email";

const glassStyle = {
  background: "rgba(0, 43, 41, 0.80)",
  border: "1px solid rgba(212, 240, 227, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

/* ─── Sub-components ────────────────────────────────── */
const StatusBadge = ({ status }: { status: EmailItem["status"] }) => {
  const config = {
    validated: {
      icon: CheckCircle2,
      label: "Validé",
      bg: "rgba(4,135,64,0.12)",
      text: "#48C970",
      border: "rgba(4,135,64,0.20)",
    },
    pending: {
      icon: Clock,
      label: "En attente",
      bg: "rgba(245,158,11,0.12)",
      text: "#F59E0B",
      border: "rgba(245,158,11,0.20)",
    },
    error: {
      icon: AlertCircle,
      label: "À vérifier",
      bg: "rgba(227,6,19,0.12)",
      text: "#F87171",
      border: "rgba(227,6,19,0.20)",
    },
    corrected: {
      icon: Sparkles,
      label: "Corrigé",
      bg: "rgba(167,139,250,0.12)",
      text: "#A78BFA",
      border: "rgba(167,139,250,0.20)",
    },
  };
  const { icon: Icon, label, bg, text, border } = config[status];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]"
      style={{ background: bg, color: text, border: `1px solid ${border}`, fontWeight: 500 }}
    >
      <Icon size={11} />
      {label}
    </span>
  );
};

const ConfidenceMeter = ({ value }: { value: number }) => {
  const color = value >= 90 ? "#48C970" : value >= 70 ? "#F59E0B" : "#F87171";
  const glowColor = value >= 90 ? "rgba(72,201,112,0.50)" : value >= 70 ? "rgba(245,158,11,0.50)" : "rgba(248,113,113,0.50)";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(212,240,227,0.08)" }}>
        <div
          className="h-full rounded-full"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 6px ${glowColor}` }}
        />
      </div>
      <span
        className="text-[11px]"
        style={{ color, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}
      >
        {value.toFixed(1)}%
      </span>
    </div>
  );
};

const UrgencyDot = ({ urgency }: { urgency: EmailItem["urgency"] }) => {
  const colors: Record<string, string> = { haute: "#E30613", moyenne: "#F59E0B", basse: "#48C970" };
  const color = colors[urgency];
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color, boxShadow: urgency === "haute" ? `0 0 8px ${color}` : "none" }}
        />
        {urgency === "haute" && (
          <div
            className="absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-60"
            style={{ backgroundColor: color }}
          />
        )}
      </div>
      <span className="text-[11px] capitalize" style={{ color: "rgba(212,240,227,0.50)" }}>{urgency}</span>
    </div>
  );
};

/* ─── Main component ───────────────────────────────── */
interface RecentEmailsProps {
  emails: EmailItem[];
  onValidate: (id: string) => void;
  onCorrect: (id: string, newCategory: string, newMailbox: string, reason: string) => void;
}

export function RecentEmails({ emails, onValidate, onCorrect }: RecentEmailsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);

  const correctionCount = emails.filter((e) => e.status === "corrected").length;
  const pendingCount = emails.filter((e) => e.status === "pending" || e.status === "error").length;

  const filteredEmails = emails.filter((email) => {
    const matchSearch =
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.from.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || email.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <>
      {selectedEmail && (
        <EmailReviewModal
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
          onValidate={(id) => { onValidate(id); setSelectedEmail(null); }}
          onCorrect={(id, cat, mb, r) => { onCorrect(id, cat, mb, r); setSelectedEmail(null); }}
        />
      )}

      <div className="rounded-2xl overflow-hidden" style={glassStyle}>
        {/* Header */}
        <div
          className="p-5"
          style={{ borderBottom: "1px solid rgba(212,240,227,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
                Emails récents
              </h3>
              <p className="text-[12px] mt-0.5" style={{ color: "rgba(212,240,227,0.45)" }}>
                Derniers emails traités automatiquement
              </p>
            </div>

            <div className="flex items-center gap-2">
              {correctionCount > 0 && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
                  style={{ background: "rgba(167,139,250,0.12)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.20)", fontWeight: 500 }}
                >
                  <Sparkles size={11} />
                  {correctionCount} correction{correctionCount > 1 ? "s" : ""}
                </span>
              )}
              {pendingCount > 0 && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]"
                  style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.20)", fontWeight: 500 }}
                >
                  <AlertTriangle size={11} />
                  {pendingCount} en attente
                </span>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(212,240,227,0.35)" }} />
              <input
                type="text"
                placeholder="Rechercher un email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg text-[12px] outline-none transition-all"
                style={{
                  background: "rgba(0, 56, 51, 0.50)",
                  border: "1px solid rgba(212,240,227,0.08)",
                  color: "#F0FFF8",
                }}
              />
            </div>
            <div
              className="flex items-center gap-1 rounded-lg p-0.5"
              style={{ background: "rgba(0, 56, 51, 0.40)", border: "1px solid rgba(212,240,227,0.06)" }}
            >
              {[
                { value: "all", label: "Tous" },
                { value: "validated", label: "Validés" },
                { value: "pending", label: "En attente" },
                { value: "error", label: "Erreurs" },
                { value: "corrected", label: "Corrigés" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilterStatus(f.value)}
                  className="px-3 py-1.5 rounded-md text-[11px] transition-all"
                  style={{
                    background: filterStatus === f.value ? "rgba(4,135,64,0.20)" : "transparent",
                    color: filterStatus === f.value ? "#48C970" : "rgba(212,240,227,0.45)",
                    border: filterStatus === f.value ? "1px solid rgba(4,135,64,0.25)" : "1px solid transparent",
                    fontWeight: filterStatus === f.value ? 600 : 400,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(212,240,227,0.05)" }}>
                {["Email", "Catégorie", "Précision", "Urgence", "Destination", "Statut", "Actions"].map((h, i) => (
                  <th
                    key={h}
                    className={`py-2.5 ${i === 0 ? "px-5" : "px-3"} text-[11px] uppercase tracking-wider ${i === 6 ? "text-right" : "text-left"}`}
                    style={{ fontWeight: 500, color: "rgba(212,240,227,0.35)", background: "rgba(0,56,51,0.20)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((email) => {
                const isActionable = email.status === "pending" || email.status === "error";
                return (
                  <tr
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className="transition-all duration-150 group cursor-pointer"
                    style={{
                      borderBottom: "1px solid rgba(212,240,227,0.03)",
                      background: isActionable
                        ? "rgba(245,158,11,0.04)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = isActionable
                        ? "rgba(245,158,11,0.07)"
                        : "rgba(4,135,64,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = isActionable
                        ? "rgba(245,158,11,0.04)"
                        : "transparent";
                    }}
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                          style={{
                            background: isActionable ? "rgba(245,158,11,0.12)" : "rgba(212,240,227,0.06)",
                            border: isActionable ? "1px solid rgba(245,158,11,0.20)" : "1px solid rgba(212,240,227,0.06)",
                          }}
                        >
                          {isActionable
                            ? <AlertTriangle size={14} style={{ color: "#F59E0B" }} />
                            : <Mail size={14} style={{ color: "rgba(212,240,227,0.40)" }} />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] truncate max-w-[250px]" style={{ fontWeight: 500, color: "#F0FFF8" }}>
                            {email.subject}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p
                              className="text-[11px] truncate max-w-[180px]"
                              style={{ color: "rgba(212,240,227,0.40)", fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              {email.from}
                            </p>
                            <span
                              className="text-[10px]"
                              style={{ color: "rgba(212,240,227,0.30)", fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              {email.time}
                            </span>
                            {email.hasAttachment && (
                              <span className="inline-flex items-center gap-0.5 text-[10px]" style={{ color: "rgba(212,240,227,0.40)" }}>
                                <Paperclip size={10} />
                                {email.attachmentType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] text-white"
                        style={{ backgroundColor: email.categoryColor, fontWeight: 500 }}
                      >
                        {email.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <ConfidenceMeter value={email.confidence} />
                    </td>
                    <td className="py-3 px-3">
                      <UrgencyDot urgency={email.urgency} />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <ArrowRight size={10} style={{ color: "rgba(212,240,227,0.30)" }} />
                        <span
                          className="text-[11px]"
                          style={{ color: isActionable ? "#F59E0B" : "rgba(212,240,227,0.45)" }}
                        >
                          {email.destination}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={email.status} />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        {isActionable ? (
                          <button
                            onClick={() => setSelectedEmail(email)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white text-[11px] transition-all"
                            style={{
                              background: "rgba(245,158,11,0.20)",
                              border: "1px solid rgba(245,158,11,0.30)",
                              color: "#F59E0B",
                              fontWeight: 500,
                            }}
                          >
                            <AlertTriangle size={11} />
                            Valider
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedEmail(email)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all opacity-0 group-hover:opacity-100"
                            style={{
                              background: "rgba(4,135,64,0.10)",
                              border: "1px solid rgba(4,135,64,0.20)",
                              color: "#48C970",
                              fontWeight: 500,
                            }}
                          >
                            <RotateCcw size={11} />
                            Corriger
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

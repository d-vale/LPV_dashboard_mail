import { useState } from "react";
import {
  Mail,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  ArrowRight,
  Search,
  RotateCcw,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { EmailReviewModal } from "./email-review-modal";
import type { EmailItem } from "../types/email";

/* ─── Sub-components ─────────────────────────────────── */
const StatusBadge = ({ status }: { status: EmailItem["status"] }) => {
  const config = {
    validated: { icon: CheckCircle2, label: "Validé", bg: "bg-emerald-50", text: "text-emerald-600" },
    pending: { icon: Clock, label: "En attente", bg: "bg-amber-50", text: "text-amber-600" },
    error: { icon: AlertCircle, label: "À vérifier", bg: "bg-red-50", text: "text-red-600" },
    corrected: { icon: Sparkles, label: "Corrigé", bg: "bg-purple-50", text: "text-purple-600" },
  };
  const { icon: Icon, label, bg, text } = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${bg} ${text}`} style={{ fontWeight: 500 }}>
      <Icon size={12} />
      {label}
    </span>
  );
};

const ConfidenceMeter = ({ value }: { value: number }) => {
  const color = value >= 90 ? "#449850" : value >= 70 ? "#F59E0B" : "#DC2626";
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px]" style={{ color, fontWeight: 600 }}>{value.toFixed(1)}%</span>
    </div>
  );
};

const UrgencyDot = ({ urgency }: { urgency: EmailItem["urgency"] }) => {
  const colors = { haute: "#E30613", moyenne: "#F59E0B", basse: "#10B981" };
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[urgency] }} />
        {urgency === "haute" && (
          <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-60" style={{ backgroundColor: colors[urgency] }} />
        )}
      </div>
      <span className="text-[11px] text-[#6B7280] capitalize">{urgency}</span>
    </div>
  );
};

/* ─── Main component ─────────────────────────────────── */
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

      <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-black/5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
                Emails récents
              </h3>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                Derniers emails traités automatiquement
              </p>
            </div>

            <div className="flex items-center gap-2">
              {correctionCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 text-[11px]" style={{ fontWeight: 500 }}>
                  <Sparkles size={11} />
                  {correctionCount} correction{correctionCount > 1 ? "s" : ""} enregistrée{correctionCount > 1 ? "s" : ""}
                </span>
              )}
              {pendingCount > 0 && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px]" style={{ fontWeight: 500 }}>
                  <AlertTriangle size={11} />
                  {pendingCount} en attente
                </span>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Rechercher un email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F7F8FA] rounded-lg text-[12px] border border-transparent focus:border-[#449850]/20 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 bg-[#F7F8FA] rounded-lg p-0.5">
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
                  className={`px-3 py-1.5 rounded-md text-[11px] transition-all ${
                    filterStatus === f.value
                      ? "bg-white text-[#1B1B2F] shadow-sm"
                      : "text-[#6B7280] hover:text-[#1B1B2F]"
                  }`}
                  style={{ fontWeight: filterStatus === f.value ? 600 : 400 }}
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
              <tr className="border-b border-black/5">
                <th className="text-left py-2.5 px-5 text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 500 }}>Email</th>
                <th className="text-left py-2.5 px-3 text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 500 }}>Catégorie</th>
                <th className="text-left py-2.5 px-3 text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 500 }}>Précision</th>
                <th className="text-left py-2.5 px-3 text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 500 }}>Urgence</th>
                <th className="text-left py-2.5 px-3 text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 500 }}>Destination</th>
                <th className="text-left py-2.5 px-3 text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 500 }}>Statut</th>
                <th className="py-2.5 px-3 text-[11px] text-[#9CA3AF] uppercase tracking-wider text-right" style={{ fontWeight: 500 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmails.map((email) => {
                const isActionable = email.status === "pending" || email.status === "error";
                return (
                  <tr
                    key={email.id}
                    onClick={() => setSelectedEmail(email)}
                    className={`border-b border-black/[0.03] transition-colors group cursor-pointer ${
                      isActionable
                        ? "bg-amber-50/40 hover:bg-amber-50/70"
                        : "hover:bg-[#F7F8FA]/50"
                    }`}
                  >
                    <td className="py-3 px-5">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          isActionable ? "bg-amber-100" : "bg-[#F3F4F6]"
                        }`}>
                          {isActionable
                            ? <AlertTriangle size={14} className="text-amber-500" />
                            : <Mail size={14} className="text-[#6B7280]" />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12px] text-[#1B1B2F] truncate max-w-[250px]" style={{ fontWeight: 500 }}>
                            {email.subject}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[11px] text-[#9CA3AF] truncate max-w-[180px]">{email.from}</p>
                            <span className="text-[10px] text-[#9CA3AF]">{email.time}</span>
                            {email.hasAttachment && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-[#6B7280]">
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
                        <ArrowRight size={10} className="text-[#9CA3AF]" />
                        <span className={`text-[11px] ${isActionable ? "text-amber-600" : "text-[#6B7280]"}`}>
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
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] transition-colors"
                            style={{ fontWeight: 500 }}
                          >
                            <AlertTriangle size={11} />
                            Valider
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedEmail(email)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#E5E7EB] text-[#6B7280] hover:border-[#449850]/30 hover:text-[#449850] hover:bg-[#449850]/5 text-[11px] transition-colors opacity-0 group-hover:opacity-100"
                            style={{ fontWeight: 500 }}
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
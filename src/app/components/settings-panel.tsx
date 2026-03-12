import { useState } from "react";
import type { ReactNode } from "react";
import {
  Mail,
  Cpu,
  Bell,
  Shield,
  AlertTriangle,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Edit3,
  ArrowRight,
  Zap,
  CheckCircle2,
  RotateCcw,
  X,
  ChevronDown,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────── */
interface AIRoutingRule {
  id: string;
  label: string;
  conditionType: "category" | "keyword" | "sender" | "attachment";
  conditionValue: string;
  destinationMailbox: string;
  active: boolean;
  aiAssisted: boolean;
}

interface RuleModalProps {
  rule?: AIRoutingRule | null;
  onSave: (rule: Omit<AIRoutingRule, "id">) => void;
  onClose: () => void;
}

/* ─── Data ───────────────────────────────────────────── */
const MAILBOXES = [
  "Prescriptions",
  "Rapports",
  "Facturation",
  "Thérapies",
  "Administration",
  "Urgences",
  "Spam / Non-pertinent",
  "À réviser manuellement",
];

const CONDITION_TYPES = [
  { value: "category", label: "Catégorie détectée" },
  { value: "keyword", label: "Mot-clé dans le sujet/corps" },
  { value: "sender", label: "Domaine ou adresse expéditeur" },
  { value: "attachment", label: "Type de pièce jointe" },
];

const initialRules: AIRoutingRule[] = [
  { id: "r1", label: "Prescriptions CPAP / VMAS", conditionType: "category", conditionValue: "prescription_medicale", destinationMailbox: "Prescriptions", active: true, aiAssisted: true },
  { id: "r2", label: "Rapports polysomnographie", conditionType: "keyword", conditionValue: "rapport, polysomnographie, PSG", destinationMailbox: "Rapports", active: true, aiAssisted: true },
  { id: "r3", label: "Factures & assurances", conditionType: "keyword", conditionValue: "facture, prise en charge, remboursement", destinationMailbox: "Facturation", active: true, aiAssisted: false },
  { id: "r4", label: "Demandes de thérapie", conditionType: "category", conditionValue: "demande_therapie", destinationMailbox: "Thérapies", active: true, aiAssisted: true },
  { id: "r5", label: "Demandes administratives", conditionType: "keyword", conditionValue: "rendez-vous, information, question, horaire", destinationMailbox: "Administration", active: true, aiAssisted: false },
  { id: "r6", label: "Urgences médicales", conditionType: "category", conditionValue: "urgence", destinationMailbox: "Urgences", active: true, aiAssisted: true },
];

/* ─── Glass style ──────────────────────────────────── */
const glassStyle = {
  background: "rgba(0, 43, 41, 0.80)",
  border: "1px solid rgba(212, 240, 227, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

const inputStyle = {
  background: "rgba(0, 56, 51, 0.50)",
  border: "1px solid rgba(212, 240, 227, 0.10)",
  color: "#F0FFF8",
  outline: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  fontSize: "13px",
  width: "100%",
};

/* ─── Toggle ─────────────────────────────────────────── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none"
      style={{
        background: checked ? "#048740" : "rgba(212,240,227,0.15)",
        boxShadow: checked ? "0 0 12px rgba(4,135,64,0.40)" : "none",
        border: checked ? "1px solid rgba(4,135,64,0.40)" : "1px solid rgba(212,240,227,0.10)",
      }}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(24px)" : "translateX(4px)" }}
      />
    </button>
  );
}

/* ─── Section Card ───────────────────────────────────── */
function SectionCard({ icon, iconBg, title, children }: { icon: ReactNode; iconBg: string; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={glassStyle}>
      <div
        className="px-6 py-5 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(212,240,227,0.06)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: iconBg, border: "1px solid rgba(212,240,227,0.06)" }}
        >
          {icon}
        </div>
        <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
          {title}
        </h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

/* ─── Rule Modal ─────────────────────────────────────── */
function RuleModal({ rule, onSave, onClose }: RuleModalProps) {
  const [label, setLabel] = useState(rule?.label ?? "");
  const [conditionType, setConditionType] = useState<AIRoutingRule["conditionType"]>(rule?.conditionType ?? "category");
  const [conditionValue, setConditionValue] = useState(rule?.conditionValue ?? "");
  const [destinationMailbox, setDestinationMailbox] = useState(rule?.destinationMailbox ?? MAILBOXES[0]);
  const [aiAssisted, setAiAssisted] = useState(rule?.aiAssisted ?? true);

  const handleSave = () => {
    if (!label.trim() || !conditionValue.trim()) return;
    onSave({ label, conditionType, conditionValue, destinationMailbox, active: rule?.active ?? true, aiAssisted });
  };

  const conditionPlaceholder: Record<AIRoutingRule["conditionType"], string> = {
    category: "ex. prescription_medicale, urgence, rapport…",
    keyword: "ex. facture, rendez-vous, remboursement",
    sender: "ex. @hopvd.ch, medecin@clinique.ch",
    attachment: "ex. .pdf, .docx, image",
  };

  const modalStyle = {
    background: "rgba(0, 26, 25, 0.98)",
    border: "1px solid rgba(212, 240, 227, 0.10)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,8,8,0.70)", backdropFilter: "blur(4px)" }}>
      <div className="rounded-2xl shadow-2xl w-full max-w-lg" style={modalStyle}>
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(212,240,227,0.06)" }}
        >
          <h4 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
            {rule ? "Modifier la règle" : "Nouvelle règle d'aiguillage"}
          </h4>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ background: "rgba(212,240,227,0.05)", color: "rgba(212,240,227,0.50)" }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {[
            { lbl: "Nom de la règle", val: label, set: setLabel, ph: "ex. Prescriptions CPAP", type: "text" as const },
            { lbl: "Valeur de la condition", val: conditionValue, set: setConditionValue, ph: conditionPlaceholder[conditionType], type: "text" as const },
          ].map(({ lbl, val, set, ph, type }) => (
            <div key={lbl}>
              <label className="block text-[12px] mb-1.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.60)" }}>
                {lbl}
              </label>
              <input
                type={type}
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder={ph}
                style={inputStyle}
              />
            </div>
          ))}

          <div>
            <label className="block text-[12px] mb-1.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.60)" }}>
              Si l'email contient / correspond à…
            </label>
            <div className="relative">
              <select
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value as AIRoutingRule["conditionType"])}
                style={{ ...inputStyle, appearance: "none" }}
              >
                {CONDITION_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value} style={{ background: "#002B29" }}>{ct.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(212,240,227,0.35)" }} />
            </div>
          </div>

          <div>
            <label className="block text-[12px] mb-1.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.60)" }}>
              Alors → aiguiller vers la boîte
            </label>
            <div className="relative">
              <select
                value={destinationMailbox}
                onChange={(e) => setDestinationMailbox(e.target.value)}
                style={{ ...inputStyle, appearance: "none" }}
              >
                {MAILBOXES.map((mb) => (
                  <option key={mb} value={mb} style={{ background: "#002B29" }}>📂 {mb}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "rgba(212,240,227,0.35)" }} />
            </div>
          </div>

          <div
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)" }}
          >
            <div>
              <p className="text-[12px]" style={{ fontWeight: 500, color: "#F0FFF8" }}>Assistance algorithmique</p>
              <p className="text-[11px]" style={{ color: "rgba(212,240,227,0.45)" }}>
                L'algorithme affine automatiquement cette règle.
              </p>
            </div>
            <Toggle checked={aiAssisted} onChange={() => setAiAssisted(!aiAssisted)} />
          </div>
        </div>

        <div
          className="flex items-center justify-end gap-3 px-6 py-4"
          style={{ borderTop: "1px solid rgba(212,240,227,0.06)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] rounded-lg transition-colors"
            style={{ color: "rgba(212,240,227,0.50)", background: "rgba(212,240,227,0.05)" }}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!label.trim() || !conditionValue.trim()}
            className="px-4 py-2 text-[13px] rounded-lg transition-all"
            style={{
              background: "rgba(4,135,64,0.25)",
              border: "1px solid rgba(4,135,64,0.35)",
              color: "#48C970",
              fontWeight: 500,
              opacity: (!label.trim() || !conditionValue.trim()) ? 0.4 : 1,
              cursor: (!label.trim() || !conditionValue.trim()) ? "not-allowed" : "pointer",
            }}
          >
            Enregistrer la règle
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export function SettingsPanel() {
  const [imapServer, setImapServer] = useState("imap.lpvd.ch");
  const [imapPort, setImapPort] = useState("993");
  const [emailAddress, setEmailAddress] = useState("info@lpvd.ch");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [autoTransfer, setAutoTransfer] = useState(true);
  const [notificationsActive, setNotificationsActive] = useState(true);
  const [notifUrgent, setNotifUrgent] = useState(true);
  const [notifErrors, setNotifErrors] = useState(true);
  const [notifReport, setNotifReport] = useState(false);
  const [rules, setRules] = useState<AIRoutingRule[]>(initialRules);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AIRoutingRule | null>(null);
  const [saved, setSaved] = useState(false);

  const conditionTypeLabel: Record<AIRoutingRule["conditionType"], string> = {
    category: "Catégorie", keyword: "Mot-clé", sender: "Expéditeur", attachment: "Pièce jointe",
  };

  const conditionTypeBadgeColor: Record<AIRoutingRule["conditionType"], string> = {
    category: "#A78BFA", keyword: "#22D3EE", sender: "#F59E0B", attachment: "#34D399",
  };

  const handleAddRule = (data: Omit<AIRoutingRule, "id">) => {
    setRules((prev) => [...prev, { ...data, id: `r${Date.now()}` }]);
    setShowModal(false);
  };

  const handleUpdateRule = (data: Omit<AIRoutingRule, "id">) => {
    if (!editingRule) return;
    setRules((prev) => prev.map((r) => (r.id === editingRule.id ? { ...r, ...data } : r)));
    setEditingRule(null);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      {(showModal || editingRule) && (
        <RuleModal
          rule={editingRule}
          onSave={editingRule ? handleUpdateRule : handleAddRule}
          onClose={() => { setShowModal(false); setEditingRule(null); }}
        />
      )}

      <div className="max-w-3xl space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-[22px]" style={{ fontWeight: 700, color: "#F0FFF8" }}>Paramètres</h2>
          <p className="text-[13px] mt-0.5" style={{ color: "rgba(212,240,227,0.45)" }}>
            Configuration du système de tri automatique
          </p>
        </div>

        {/* 1. Email server */}
        <SectionCard
          icon={<Mail size={18} style={{ color: "#48C970" }} />}
          iconBg="rgba(4,135,64,0.12)"
          title="Connexion au serveur email"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[12px] mb-1.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.55)" }}>Serveur IMAP</label>
              <input type="text" value={imapServer} onChange={(e) => setImapServer(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label className="block text-[12px] mb-1.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.55)" }}>Port</label>
              <input type="text" value={imapPort} onChange={(e) => setImapPort(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[12px] mb-1.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.55)" }}>Adresse email</label>
            <input type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} style={inputStyle} />
          </div>

          <div className="mt-4">
            <label className="block text-[12px] mb-1.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.55)" }}>Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...inputStyle, paddingRight: 40 }}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: "rgba(212,240,227,0.35)" }}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div
            className="mt-4 rounded-xl px-4 py-3 flex items-start gap-3"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
          >
            <span style={{ color: "#F59E0B" }} className="mt-0.5 shrink-0">🔑</span>
            <p className="text-[12px]" style={{ color: "rgba(245,158,11,0.80)" }}>
              Pour la sécurité, utilisez un mot de passe d'application spécifique.
            </p>
          </div>
        </SectionCard>

        {/* 2. AI Engine */}
        <SectionCard
          icon={<Cpu size={18} style={{ color: "#A78BFA" }} />}
          iconBg="rgba(167,139,250,0.12)"
          title="Configuration du moteur de classification"
        >
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px]" style={{ fontWeight: 500, color: "rgba(212,240,227,0.55)" }}>
                Seuil de précision minimum
              </label>
              <span
                className="text-[13px]"
                style={{ fontWeight: 600, color: "#48C970", fontFamily: "'JetBrains Mono', monospace" }}
              >
                {confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#048740" }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[11px]" style={{ color: "rgba(212,240,227,0.30)" }}>50% (Permissif)</span>
              <span className="text-[11px]" style={{ color: "rgba(212,240,227,0.30)" }}>100% (Strict)</span>
            </div>
            <p
              className="text-[11px] mt-2 rounded-lg px-3 py-2"
              style={{ color: "rgba(212,240,227,0.50)", background: "rgba(0,56,51,0.40)" }}
            >
              Les emails avec une précision inférieure à {confidenceThreshold}% seront marqués pour révision manuelle.
            </p>
          </div>

          <div
            className="flex items-center justify-between py-3"
            style={{ borderTop: "1px solid rgba(212,240,227,0.06)" }}
          >
            <div>
              <p className="text-[13px]" style={{ fontWeight: 500, color: "#F0FFF8" }}>Transfert automatique</p>
              <p className="text-[12px]" style={{ color: "rgba(212,240,227,0.40)" }}>Rediriger automatiquement les emails classifiés</p>
            </div>
            <Toggle checked={autoTransfer} onChange={() => setAutoTransfer(!autoTransfer)} />
          </div>
        </SectionCard>

        {/* 3. AI Routing Rules */}
        <div className="rounded-2xl overflow-hidden" style={glassStyle}>
          <div
            className="px-6 py-5 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(212,240,227,0.06)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(4,135,64,0.12)", border: "1px solid rgba(4,135,64,0.15)" }}
              >
                <Zap size={18} style={{ color: "#48C970" }} />
              </div>
              <div>
                <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>Règles d'aiguillage</h3>
                <p className="text-[12px]" style={{ color: "rgba(212,240,227,0.40)" }}>
                  Indiquez quels emails envoyer dans quelle boîte
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] transition-all"
              style={{
                background: "rgba(4,135,64,0.20)",
                border: "1px solid rgba(4,135,64,0.30)",
                color: "#48C970",
                fontWeight: 500,
                boxShadow: "0 0 16px rgba(4,135,64,0.10)",
              }}
            >
              <Plus size={14} />
              Nouvelle règle
            </button>
          </div>

          <div
            className="px-6 py-3"
            style={{ background: "rgba(0,56,51,0.20)", borderBottom: "1px solid rgba(212,240,227,0.04)" }}
          >
            <p className="text-[12px]" style={{ color: "rgba(212,240,227,0.50)" }}>
              <span style={{ color: "#48C970", fontWeight: 600 }}>Comment ça fonctionne :</span>{" "}
              Pour chaque email sur <span style={{ color: "#F0FFF8", fontWeight: 500 }}>info@lpvd.ch</span>, le système applique la première règle correspondante.
            </p>
          </div>

          <div
            className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-6 py-2.5"
            style={{ background: "rgba(0,56,51,0.15)", borderBottom: "1px solid rgba(212,240,227,0.04)" }}
          >
            {["Règle", "Condition SI…", "Alors → Boîte", "Actions"].map((h) => (
              <span key={h} className="text-[11px] uppercase tracking-wider" style={{ fontWeight: 600, color: "rgba(212,240,227,0.30)" }}>
                {h}
              </span>
            ))}
          </div>

          <div>
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-6 py-4 items-center transition-all"
                style={{
                  borderBottom: "1px solid rgba(212,240,227,0.04)",
                  opacity: rule.active ? 1 : 0.35,
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLDivElement).style.background = "rgba(4,135,64,0.04)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13px] truncate" style={{ fontWeight: 500, color: "#F0FFF8" }}>
                      {rule.label}
                    </span>
                    {rule.aiAssisted && (
                      <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] shrink-0"
                        style={{ background: "rgba(167,139,250,0.12)", color: "#A78BFA", border: "1px solid rgba(167,139,250,0.15)", fontWeight: 500 }}
                      >
                        <Zap size={9} />Auto
                      </span>
                    )}
                  </div>
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] mt-1"
                    style={{
                      background: `${conditionTypeBadgeColor[rule.conditionType]}12`,
                      color: conditionTypeBadgeColor[rule.conditionType],
                      border: `1px solid ${conditionTypeBadgeColor[rule.conditionType]}20`,
                      fontWeight: 500,
                    }}
                  >
                    {conditionTypeLabel[rule.conditionType]}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-[12px] truncate" style={{ color: "rgba(212,240,227,0.50)", fontFamily: "'JetBrains Mono', monospace" }} title={rule.conditionValue}>
                    {rule.conditionValue}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                  <ArrowRight size={12} style={{ color: "#48C970", flexShrink: 0 }} />
                  <span className="text-[12px] truncate" style={{ fontWeight: 500, color: "#48C970" }}>
                    {rule.destinationMailbox}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Toggle checked={rule.active} onChange={() => setRules((prev) => prev.map((r) => r.id === rule.id ? { ...r, active: !r.active } : r))} />
                  <button
                    onClick={() => setEditingRule(rule)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: "rgba(212,240,227,0.35)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#F0FFF8"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = "rgba(212,240,227,0.35)"}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setRules((prev) => prev.filter((r) => r.id !== rule.id))}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: "rgba(212,240,227,0.35)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = "#F87171"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = "rgba(212,240,227,0.35)"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {rules.length === 0 && (
              <div className="px-6 py-10 text-center">
                <Zap size={28} className="mx-auto mb-2" style={{ color: "rgba(212,240,227,0.20)" }} />
                <p className="text-[13px]" style={{ color: "rgba(212,240,227,0.40)" }}>Aucune règle configurée.</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. Notifications */}
        <SectionCard
          icon={<Bell size={18} style={{ color: "#22D3EE" }} />}
          iconBg="rgba(34,211,238,0.10)"
          title="Notifications"
        >
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-[13px]" style={{ fontWeight: 500, color: "#F0FFF8" }}>Notifications actives</p>
              <p className="text-[12px]" style={{ color: "rgba(212,240,227,0.40)" }}>Recevoir des alertes pour les événements importants</p>
            </div>
            <Toggle checked={notificationsActive} onChange={() => setNotificationsActive(!notificationsActive)} />
          </div>

          <div className={`mt-4 space-y-3 transition-opacity ${!notificationsActive ? "opacity-40 pointer-events-none" : ""}`}>
            {[
              { label: "Emails urgents détectés", value: notifUrgent, onChange: () => setNotifUrgent(!notifUrgent) },
              { label: "Erreurs de classification", value: notifErrors, onChange: () => setNotifErrors(!notifErrors) },
              { label: "Rapport quotidien d'activité", value: notifReport, onChange: () => setNotifReport(!notifReport) },
            ].map(({ label, value, onChange }) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={onChange}
                  className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{
                    background: value ? "#048740" : "transparent",
                    borderColor: value ? "#048740" : "rgba(212,240,227,0.20)",
                    boxShadow: value ? "0 0 8px rgba(4,135,64,0.40)" : "none",
                  }}
                >
                  {value && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[13px]" style={{ color: "rgba(212,240,227,0.80)" }}>{label}</span>
              </label>
            ))}
          </div>
        </SectionCard>

        {/* 5. Security */}
        <SectionCard
          icon={<Shield size={18} style={{ color: "#48C970" }} />}
          iconBg="rgba(4,135,64,0.12)"
          title="Sécurité et protection des données"
        >
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-3 mb-4"
            style={{ background: "rgba(4,135,64,0.08)", border: "1px solid rgba(4,135,64,0.15)" }}
          >
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: "#48C970" }} />
            <div>
              <p className="text-[12px]" style={{ fontWeight: 600, color: "#48C970" }}>Conformité GDPR/HIPAA active</p>
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(212,240,227,0.50)" }}>
                Toutes les données médicales sont chiffrées de bout en bout (AES-256).
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Chiffrement des emails", value: "AES-256 actif", color: "#48C970" },
              { label: "Authentification à deux facteurs", value: "Activée", color: "#48C970" },
              { label: "Dernière sauvegarde", value: "Il y a 2 heures", color: "rgba(212,240,227,0.50)" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center justify-between py-2"
                style={{ borderBottom: "1px solid rgba(212,240,227,0.05)" }}
              >
                <span className="text-[13px]" style={{ color: "rgba(212,240,227,0.55)" }}>{label}</span>
                <span className="text-[12px]" style={{ fontWeight: 500, color, fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* 6. Danger zone */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(227,6,19,0.05)", border: "1px solid rgba(227,6,19,0.15)" }}
        >
          <div
            className="px-6 py-5 flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(227,6,19,0.10)" }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(227,6,19,0.12)", border: "1px solid rgba(227,6,19,0.20)" }}
            >
              <AlertTriangle size={18} style={{ color: "#F87171" }} />
            </div>
            <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F87171" }}>Zone de danger</h3>
          </div>
          <div className="px-6 py-5 flex flex-wrap gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] transition-all"
              style={{ background: "rgba(227,6,19,0.08)", border: "1px solid rgba(227,6,19,0.20)", color: "#F87171", fontWeight: 500 }}
            >
              <RotateCcw size={14} />
              Réinitialiser toutes les règles
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] transition-all"
              style={{ background: "rgba(227,6,19,0.08)", border: "1px solid rgba(227,6,19,0.20)", color: "#F87171", fontWeight: 500 }}
            >
              <Trash2 size={14} />
              Supprimer l'historique
            </button>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pb-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] transition-all"
            style={{
              background: saved ? "rgba(4,135,64,0.30)" : "rgba(4,135,64,0.20)",
              border: "1px solid rgba(4,135,64,0.35)",
              color: "#48C970",
              fontWeight: 600,
              boxShadow: saved ? "0 0 24px rgba(4,135,64,0.30)" : "0 0 12px rgba(4,135,64,0.15)",
            }}
          >
            {saved ? (
              <><CheckCircle2 size={16} />Modifications sauvegardées !</>
            ) : (
              <><Save size={16} />Sauvegarder les modifications</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

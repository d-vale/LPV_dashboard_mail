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
  Server,
  RotateCcw,
  X,
  ChevronDown,
  GripVertical,
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
  {
    id: "r1",
    label: "Prescriptions CPAP / VMAS",
    conditionType: "category",
    conditionValue: "prescription_medicale",
    destinationMailbox: "Prescriptions",
    active: true,
    aiAssisted: true,
  },
  {
    id: "r2",
    label: "Rapports polysomnographie",
    conditionType: "keyword",
    conditionValue: "rapport, polysomnographie, PSG",
    destinationMailbox: "Rapports",
    active: true,
    aiAssisted: true,
  },
  {
    id: "r3",
    label: "Factures & assurances",
    conditionType: "keyword",
    conditionValue: "facture, prise en charge, remboursement",
    destinationMailbox: "Facturation",
    active: true,
    aiAssisted: false,
  },
  {
    id: "r4",
    label: "Demandes de thérapie",
    conditionType: "category",
    conditionValue: "demande_therapie",
    destinationMailbox: "Thérapies",
    active: true,
    aiAssisted: true,
  },
  {
    id: "r5",
    label: "Demandes administratives",
    conditionType: "keyword",
    conditionValue: "rendez-vous, information, question, horaire",
    destinationMailbox: "Administration",
    active: true,
    aiAssisted: false,
  },
  {
    id: "r6",
    label: "Urgences médicales",
    conditionType: "category",
    conditionValue: "urgence",
    destinationMailbox: "Urgences",
    active: true,
    aiAssisted: true,
  },
];

/* ─── Toggle ─────────────────────────────────────────── */
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-[#449850]" : "bg-[#D1D5DB]"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

/* ─── Section Card ───────────────────────────────────── */
function SectionCard({
  icon,
  iconBg,
  title,
  children,
}: {
  icon: ReactNode;
  iconBg: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
      <div className="px-6 py-5 border-b border-black/5 flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}
        >
          {icon}
        </div>
        <h3
          className="text-[15px] text-[#1B1B2F]"
          style={{ fontWeight: 600 }}
        >
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
  const [conditionType, setConditionType] = useState<AIRoutingRule["conditionType"]>(
    rule?.conditionType ?? "category"
  );
  const [conditionValue, setConditionValue] = useState(rule?.conditionValue ?? "");
  const [destinationMailbox, setDestinationMailbox] = useState(
    rule?.destinationMailbox ?? MAILBOXES[0]
  );
  const [aiAssisted, setAiAssisted] = useState(rule?.aiAssisted ?? true);

  const handleSave = () => {
    if (!label.trim() || !conditionValue.trim()) return;
    onSave({
      label,
      conditionType,
      conditionValue,
      destinationMailbox,
      active: rule?.active ?? true,
      aiAssisted,
    });
  };

  const conditionPlaceholder: Record<AIRoutingRule["conditionType"], string> = {
    category: "ex. prescription_medicale, urgence, rapport…",
    keyword: "ex. facture, rendez-vous, remboursement",
    sender: "ex. @hopvd.ch, medecin@clinique.ch",
    attachment: "ex. .pdf, .docx, image",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h4 className="text-[15px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
            {rule ? "Modifier la règle" : "Nouvelle règle d'aiguillage"}
          </h4>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Label */}
          <div>
            <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
              Nom de la règle
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="ex. Prescriptions CPAP"
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] focus:ring-2 focus:ring-[#449850]/10 transition-all"
            />
          </div>

          {/* Condition type */}
          <div>
            <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
              Si l'email contient / correspond à…
            </label>
            <div className="relative">
              <select
                value={conditionType}
                onChange={(e) =>
                  setConditionType(e.target.value as AIRoutingRule["conditionType"])
                }
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] focus:ring-2 focus:ring-[#449850]/10 appearance-none bg-white transition-all"
              >
                {CONDITION_TYPES.map((ct) => (
                  <option key={ct.value} value={ct.value}>
                    {ct.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>

          {/* Condition value */}
          <div>
            <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
              Valeur de la condition
            </label>
            <input
              type="text"
              value={conditionValue}
              onChange={(e) => setConditionValue(e.target.value)}
              placeholder={conditionPlaceholder[conditionType]}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] focus:ring-2 focus:ring-[#449850]/10 transition-all"
            />
            <p className="text-[11px] text-[#9CA3AF] mt-1">
              Séparez plusieurs valeurs par des virgules.
            </p>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
              Alors → aiguiller vers la boîte
            </label>
            <div className="relative">
              <select
                value={destinationMailbox}
                onChange={(e) => setDestinationMailbox(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] focus:ring-2 focus:ring-[#449850]/10 appearance-none bg-white transition-all"
              >
                {MAILBOXES.map((mb) => (
                  <option key={mb} value={mb}>
                    📂 {mb}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>

          {/* AI assisted */}
          <div className="flex items-center justify-between bg-purple-50 rounded-xl px-4 py-3">
            <div>
              <p className="text-[12px] text-[#1B1B2F]" style={{ fontWeight: 500 }}>
                Assistance algorithmique
              </p>
              <p className="text-[11px] text-[#6B7280]">
                L'algorithme affine automatiquement cette règle avec le temps.
              </p>
            </div>
            <Toggle checked={aiAssisted} onChange={() => setAiAssisted(!aiAssisted)} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-black/5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-[#6B7280] hover:text-[#1B1B2F] hover:bg-[#F3F4F6] rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!label.trim() || !conditionValue.trim()}
            className="px-4 py-2 text-[13px] text-white bg-[#449850] hover:bg-[#367A40] rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ fontWeight: 500 }}
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
  // Email server
  const [imapServer, setImapServer] = useState("imap.lpvd.ch");
  const [imapPort, setImapPort] = useState("993");
  const [emailAddress, setEmailAddress] = useState("info@lpvd.ch");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);

  // AI config
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [autoTransfer, setAutoTransfer] = useState(true);

  // Notifications
  const [notificationsActive, setNotificationsActive] = useState(true);
  const [notifUrgent, setNotifUrgent] = useState(true);
  const [notifErrors, setNotifErrors] = useState(true);
  const [notifReport, setNotifReport] = useState(false);

  // AI Routing Rules
  const [rules, setRules] = useState<AIRoutingRule[]>(initialRules);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AIRoutingRule | null>(null);

  // Saved feedback
  const [saved, setSaved] = useState(false);

  const conditionTypeLabel: Record<AIRoutingRule["conditionType"], string> = {
    category: "Catégorie",
    keyword: "Mot-clé",
    sender: "Expéditeur",
    attachment: "Pièce jointe",
  };

  const conditionTypeBadge: Record<AIRoutingRule["conditionType"], string> = {
    category: "bg-purple-50 text-purple-600",
    keyword: "bg-blue-50 text-blue-600",
    sender: "bg-amber-50 text-amber-600",
    attachment: "bg-cyan-50 text-cyan-600",
  };

  const handleAddRule = (data: Omit<AIRoutingRule, "id">) => {
    const newId = `r${Date.now()}`;
    setRules((prev) => [...prev, { ...data, id: newId }]);
    setShowModal(false);
  };

  const handleUpdateRule = (data: Omit<AIRoutingRule, "id">) => {
    if (!editingRule) return;
    setRules((prev) =>
      prev.map((r) => (r.id === editingRule.id ? { ...r, ...data } : r))
    );
    setEditingRule(null);
  };

  const toggleRule = (id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));
  };

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      {/* Rule Modal */}
      {(showModal || editingRule) && (
        <RuleModal
          rule={editingRule}
          onSave={editingRule ? handleUpdateRule : handleAddRule}
          onClose={() => {
            setShowModal(false);
            setEditingRule(null);
          }}
        />
      )}

      <div className="max-w-3xl space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-[22px] text-[#1B1B2F]" style={{ fontWeight: 700 }}>
            Paramètres
          </h2>
          <p className="text-[13px] text-[#6B7280] mt-0.5">
            Configuration du système de tri automatique
          </p>
        </div>

        {/* ── 1. Email server ── */}
        <SectionCard
          icon={<Mail size={18} className="text-[#449850]" />}
          iconBg="bg-[#449850]/10"
          title="Connexion au serveur email"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
                Serveur IMAP
              </label>
              <input
                type="text"
                value={imapServer}
                onChange={(e) => setImapServer(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] focus:ring-2 focus:ring-[#449850]/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
                Port
              </label>
              <input
                type="text"
                value={imapPort}
                onChange={(e) => setImapPort(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] focus:ring-2 focus:ring-[#449850]/10 transition-all"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
              Adresse email
            </label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] focus:ring-2 focus:ring-[#449850]/10 transition-all"
            />
          </div>

          <div className="mt-4">
            <label className="block text-[12px] text-[#6B7280] mb-1.5" style={{ fontWeight: 500 }}>
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 pr-10 text-[13px] text-[#1B1B2F] focus:outline-none focus:border-[#449850] focus:ring-2 focus:ring-[#449850]/10 transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <span className="text-amber-500 mt-0.5 shrink-0">🔑</span>
            <p className="text-[12px] text-amber-700">
              Pour la sécurité, utilisez un mot de passe d'application spécifique plutôt que votre mot de passe principal.
            </p>
          </div>
        </SectionCard>

        {/* ── 2. AI Engine ── */}
        <SectionCard
          icon={<Cpu size={18} className="text-purple-500" />}
          iconBg="bg-purple-50"
          title="Configuration du moteur de classification"
        >
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[12px] text-[#6B7280]" style={{ fontWeight: 500 }}>
                Seuil de précision minimum
              </label>
              <span className="text-[13px] text-[#449850]" style={{ fontWeight: 600 }}>
                {confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-[#449850]"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[11px] text-[#9CA3AF]">50% (Permissif)</span>
              <span className="text-[11px] text-[#9CA3AF]">100% (Strict)</span>
            </div>
            <p className="text-[11px] text-[#6B7280] mt-2 bg-[#F7F8FA] rounded-lg px-3 py-2">
              Les emails avec une précision inférieure à {confidenceThreshold}% seront marqués pour révision manuelle.
            </p>
          </div>

          <div className="flex items-center justify-between py-3 border-t border-black/5">
            <div>
              <p className="text-[13px] text-[#1B1B2F]" style={{ fontWeight: 500 }}>
                Transfert automatique
              </p>
              <p className="text-[12px] text-[#9CA3AF]">
                Rediriger automatiquement les emails classifiés
              </p>
            </div>
            <Toggle checked={autoTransfer} onChange={() => setAutoTransfer(!autoTransfer)} />
          </div>
        </SectionCard>

        {/* ── 3. AI Routing Rules ── */}
        <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-black/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#449850]/10 flex items-center justify-center">
                <Zap size={18} className="text-[#449850]" />
              </div>
              <div>
                <h3 className="text-[15px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
                  Règles d'aiguillage
                </h3>
                <p className="text-[12px] text-[#9CA3AF]">
                  Indiquez au système quels emails envoyer dans quelle boîte
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#449850] text-white px-4 py-2 rounded-lg text-[12px] hover:bg-[#367A40] transition-colors shadow-sm shadow-[#449850]/20"
              style={{ fontWeight: 500 }}
            >
              <Plus size={14} />
              Nouvelle règle
            </button>
          </div>

          {/* Rules explanation */}
          <div className="px-6 py-3 bg-[#F7F8FA] border-b border-black/5">
            <p className="text-[12px] text-[#6B7280]">
              <span className="text-[#449850]" style={{ fontWeight: 600 }}>Comment ça fonctionne :</span>{" "}
              Pour chaque email reçu sur <span className="text-[#1B1B2F]" style={{ fontWeight: 500 }}>info@lpvd.ch</span>, le système analyse son contenu et applique la première règle correspondante pour l'aiguiller automatiquement vers la bonne boîte de réception.
            </p>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-6 py-2.5 bg-[#FAFAFA] border-b border-black/5">
            <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 600 }}>Règle</span>
            <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 600 }}>Condition SI…</span>
            <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 600 }}>Alors → Boîte</span>
            <span className="text-[11px] text-[#9CA3AF] uppercase tracking-wider" style={{ fontWeight: 600 }}>Actions</span>
          </div>

          <div className="divide-y divide-black/[0.04]">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className={`grid grid-cols-[1fr_1fr_1fr_auto] gap-3 px-6 py-4 items-center hover:bg-[#F7F8FA]/60 transition-colors ${
                  !rule.active ? "opacity-40" : ""
                }`}
              >
                {/* Name + badges */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13px] text-[#1B1B2F] truncate" style={{ fontWeight: 500 }}>
                      {rule.label}
                    </span>
                    {rule.aiAssisted && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] shrink-0" style={{ fontWeight: 500 }}>
                        <Zap size={9} />
                        Auto
                      </span>
                    )}
                  </div>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] mt-1 ${conditionTypeBadge[rule.conditionType]}`}
                    style={{ fontWeight: 500 }}
                  >
                    {conditionTypeLabel[rule.conditionType]}
                  </span>
                </div>

                {/* Condition value */}
                <div className="min-w-0">
                  <p className="text-[12px] text-[#6B7280] truncate" title={rule.conditionValue}>
                    {rule.conditionValue}
                  </p>
                </div>

                {/* Destination */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <ArrowRight size={13} className="text-[#449850] shrink-0" />
                  <span className="text-[12px] text-[#449850] truncate" style={{ fontWeight: 500 }}>
                    {rule.destinationMailbox}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <Toggle checked={rule.active} onChange={() => toggleRule(rule.id)} />
                  <button
                    onClick={() => setEditingRule(rule)}
                    className="p-1.5 rounded-lg hover:bg-[#F3F4F6] text-[#9CA3AF] hover:text-[#1B1B2F] transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-[#9CA3AF] hover:text-[#DC2626] transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {rules.length === 0 && (
            <div className="px-6 py-10 text-center">
              <Zap size={28} className="text-[#D1D5DB] mx-auto mb-2" />
              <p className="text-[13px] text-[#9CA3AF]">Aucune règle configurée.</p>
              <p className="text-[12px] text-[#D1D5DB]">Créez votre première règle pour que le système trie les emails automatiquement.</p>
            </div>
          )}
        </div>

        {/* ── 4. Notifications ── */}
        <SectionCard
          icon={<Bell size={18} className="text-blue-500" />}
          iconBg="bg-blue-50"
          title="Notifications"
        >
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-[13px] text-[#1B1B2F]" style={{ fontWeight: 500 }}>
                Notifications actives
              </p>
              <p className="text-[12px] text-[#9CA3AF]">
                Recevoir des alertes pour les événements importants
              </p>
            </div>
            <Toggle
              checked={notificationsActive}
              onChange={() => setNotificationsActive(!notificationsActive)}
            />
          </div>

          <div className={`mt-4 space-y-3 transition-opacity ${!notificationsActive ? "opacity-40 pointer-events-none" : ""}`}>
            {[
              { label: "Emails urgents détectés", value: notifUrgent, onChange: () => setNotifUrgent(!notifUrgent) },
              { label: "Erreurs de classification", value: notifErrors, onChange: () => setNotifErrors(!notifErrors) },
              { label: "Rapport quotidien d'activité", value: notifReport, onChange: () => setNotifReport(!notifReport) },
            ].map(({ label, value, onChange }) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={onChange}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    value
                      ? "bg-[#449850] border-[#449850]"
                      : "bg-white border-[#D1D5DB] group-hover:border-[#449850]/50"
                  }`}
                >
                  {value && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 8">
                      <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-[13px] text-[#1B1B2F]">{label}</span>
              </label>
            ))}
          </div>
        </SectionCard>

        {/* ── 5. Security ── */}
        <SectionCard
          icon={<Shield size={18} className="text-[#449850]" />}
          iconBg="bg-[#449850]/10"
          title="Sécurité et protection des données"
        >
          <div className="bg-[#449850]/8 border border-[#449850]/20 rounded-xl px-4 py-3 flex items-start gap-3 mb-4">
            <CheckCircle2 size={16} className="text-[#449850] mt-0.5 shrink-0" />
            <div>
              <p className="text-[12px] text-[#449850]" style={{ fontWeight: 600 }}>
                Conformité GDPR/HIPAA active
              </p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">
                Toutes les données médicales sont chiffrées de bout en bout (AES-256) et stockées selon les normes HIPAA. Les logs d'accès sont conservés de manière sécurisée.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Chiffrement des emails", value: "AES-256 actif", color: "text-[#449850]" },
              { label: "Authentification à deux facteurs", value: "Activée", color: "text-[#449850]" },
              { label: "Dernière sauvegarde", value: "Il y a 2 heures", color: "text-[#6B7280]" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                <span className="text-[13px] text-[#6B7280]">{label}</span>
                <span className={`text-[12px] ${color}`} style={{ fontWeight: 500 }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* ── 6. Danger zone ── */}
        <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-red-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={18} className="text-red-500" />
            </div>
            <h3 className="text-[15px] text-red-600" style={{ fontWeight: 600 }}>
              Zone de danger
            </h3>
          </div>
          <div className="px-6 py-5 flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-[12px] hover:bg-red-50 transition-colors" style={{ fontWeight: 500 }}>
              <RotateCcw size={14} />
              Réinitialiser toutes les règles
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg text-[12px] hover:bg-red-50 transition-colors" style={{ fontWeight: 500 }}>
              <Trash2 size={14} />
              Supprimer l'historique
            </button>
          </div>
        </div>

        {/* ── Save ── */}
        <div className="flex justify-end pb-4">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] text-white transition-all shadow-lg ${
              saved
                ? "bg-[#449850] shadow-[#449850]/30"
                : "bg-[#449850] hover:bg-[#367A40] shadow-[#449850]/20"
            }`}
            style={{ fontWeight: 600 }}
          >
            {saved ? (
              <>
                <CheckCircle2 size={16} />
                Modifications sauvegardées !
              </>
            ) : (
              <>
                <Save size={16} />
                Sauvegarder les modifications
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Eye,
  FileText,
  Server,
  Clock,
} from "lucide-react";

const complianceItems = [
  {
    category: "Protection des donnees (nLPD)",
    status: "conforme" as const,
    items: [
      { label: "Chiffrement des donnees en transit (TLS)", ok: true },
      { label: "Chiffrement des donnees au repos (AES-256)", ok: true },
      { label: "Anonymisation des donnees patients dans les logs", ok: true },
      { label: "Politique de retention des donnees (90 jours)", ok: true },
    ],
  },
  {
    category: "Infrastructure & Securite",
    status: "conforme" as const,
    items: [
      { label: "Hebergement en Suisse (infrastructure hospitaliere)", ok: true },
      { label: "Audit de securite annuel", ok: true },
      { label: "Authentification multi-facteurs (MFA)", ok: true },
      { label: "Journal d'acces complet", ok: true },
    ],
  },
  {
    category: "Transparence algorithmique",
    status: "conforme" as const,
    items: [
      { label: "Explication des decisions de classification", ok: true },
      { label: "Humain dans la boucle pour decisions critiques", ok: true },
      { label: "Documentation de l'algorithme", ok: true },
      { label: "Audit des biais de l'algorithme", ok: true },
    ],
  },
];

export function CompliancePanel() {
  return (
    <div className="space-y-5">
      {/* Score global */}
      <div className="bg-white rounded-xl p-5 border border-black/5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <Shield size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-[15px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
              Conformite nLPD / Securite
            </h3>
            <p className="text-[12px] text-[#6B7280]">
              Score global de conformite
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-[32px] text-[#10B981]" style={{ fontWeight: 700, lineHeight: 1 }}>
              100%
            </p>
            <p className="text-[11px] text-[#6B7280] mt-1">12/12 criteres</p>
          </div>
        </div>

        <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full" style={{ width: "100%" }} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Lock, label: "Donnees chiffrees", value: "100%", color: "#10B981" },
            { icon: Server, label: "Hebergement CH", value: "Actif", color: "#2563EB" },
            { icon: Clock, label: "Derniere verification", value: "Aujourd'hui", color: "#8B5CF6" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-[#F7F8FA] rounded-xl p-3 text-center">
                <Icon size={16} className="mx-auto mb-1.5" style={{ color: stat.color }} />
                <p className="text-[13px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>{stat.value}</p>
                <p className="text-[10px] text-[#9CA3AF]">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail categories */}
      {complianceItems.map((section) => (
        <div key={section.category} className="bg-white rounded-xl p-5 border border-black/5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[13px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
              {section.category}
            </h4>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] ${
                section.status === "conforme"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-amber-50 text-amber-600"
              }`}
              style={{ fontWeight: 500 }}
            >
              {section.status === "conforme" ? (
                <CheckCircle2 size={12} />
              ) : (
                <AlertTriangle size={12} />
              )}
              {section.status === "conforme" ? "Conforme" : "Attention requise"}
            </span>
          </div>
          <div className="space-y-2">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 py-1.5"
              >
                {item.ok ? (
                  <CheckCircle2 size={16} className="text-[#10B981] shrink-0" />
                ) : (
                  <AlertTriangle size={16} className="text-[#F59E0B] shrink-0" />
                )}
                <span
                  className={`text-[12px] ${
                    item.ok ? "text-[#6B7280]" : "text-[#F59E0B]"
                  }`}
                  style={{ fontWeight: item.ok ? 400 : 500 }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
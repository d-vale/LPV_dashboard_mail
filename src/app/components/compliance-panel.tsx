import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Server,
  Clock,
} from "lucide-react";

const complianceItems = [
  {
    category: "Protection des données (nLPD)",
    status: "conforme" as const,
    items: [
      { label: "Chiffrement des données en transit (TLS)", ok: true },
      { label: "Chiffrement des données au repos (AES-256)", ok: true },
      { label: "Anonymisation des données patients dans les logs", ok: true },
      { label: "Politique de rétention des données (90 jours)", ok: true },
    ],
  },
  {
    category: "Infrastructure & Sécurité",
    status: "conforme" as const,
    items: [
      { label: "Hébergement en Suisse (infrastructure hospitalière)", ok: true },
      { label: "Audit de sécurité annuel", ok: true },
      { label: "Authentification multi-facteurs (MFA)", ok: true },
      { label: "Journal d'accès complet", ok: true },
    ],
  },
  {
    category: "Transparence algorithmique",
    status: "conforme" as const,
    items: [
      { label: "Explication des décisions de classification", ok: true },
      { label: "Humain dans la boucle pour décisions critiques", ok: true },
      { label: "Documentation de l'algorithme", ok: true },
      { label: "Audit des biais de l'algorithme", ok: true },
    ],
  },
];

const glassStyle = {
  background: "rgba(0, 43, 41, 0.80)",
  border: "1px solid rgba(212, 240, 227, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

export function CompliancePanel() {
  return (
    <div className="space-y-5">
      {/* Score global */}
      <div className="rounded-2xl p-5" style={glassStyle}>
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(4,135,64,0.30), rgba(52,211,153,0.15))",
              border: "1px solid rgba(4,135,64,0.25)",
              boxShadow: "0 0 30px rgba(4,135,64,0.20)",
            }}
          >
            <Shield size={24} style={{ color: "#48C970" }} />
          </div>
          <div>
            <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
              Conformité nLPD / Sécurité
            </h3>
            <p className="text-[12px]" style={{ color: "rgba(212,240,227,0.45)" }}>
              Score global de conformité
            </p>
          </div>
          <div className="ml-auto text-right">
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2.4rem",
                color: "#48C970",
                lineHeight: 1,
                textShadow: "0 0 20px rgba(72,201,112,0.50)",
              }}
            >
              100%
            </p>
            <p className="text-[11px] mt-1" style={{ color: "rgba(212,240,227,0.40)" }}>12/12 critères</p>
          </div>
        </div>

        <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "rgba(212,240,227,0.06)" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: "100%",
              background: "linear-gradient(90deg, #048740, #48C970)",
              boxShadow: "0 0 10px rgba(4,135,64,0.50)",
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Lock, label: "Données chiffrées", value: "100%", color: "#48C970" },
            { icon: Server, label: "Hébergement CH", value: "Actif", color: "#22D3EE" },
            { icon: Clock, label: "Dernière vérification", value: "Aujourd'hui", color: "#A78BFA" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl p-3 text-center"
                style={{
                  background: "rgba(0, 56, 51, 0.40)",
                  border: "1px solid rgba(212,240,227,0.06)",
                }}
              >
                <Icon size={16} className="mx-auto mb-1.5" style={{ color: stat.color }} />
                <p
                  className="text-[13px]"
                  style={{ fontWeight: 600, color: "#F0FFF8" }}
                >
                  {stat.value}
                </p>
                <p className="text-[10px]" style={{ color: "rgba(212,240,227,0.40)" }}>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail categories */}
      {complianceItems.map((section) => (
        <div key={section.category} className="rounded-2xl p-5" style={glassStyle}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[13px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
              {section.category}
            </h4>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]"
              style={{
                background: section.status === "conforme" ? "rgba(4,135,64,0.12)" : "rgba(245,158,11,0.12)",
                color: section.status === "conforme" ? "#48C970" : "#F59E0B",
                border: `1px solid ${section.status === "conforme" ? "rgba(4,135,64,0.20)" : "rgba(245,158,11,0.20)"}`,
                fontWeight: 500,
              }}
            >
              {section.status === "conforme" ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
              {section.status === "conforme" ? "Conforme" : "Attention requise"}
            </span>
          </div>
          <div className="space-y-2">
            {section.items.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 py-1.5"
                style={{ borderBottom: "1px solid rgba(212,240,227,0.04)" }}
              >
                {item.ok ? (
                  <CheckCircle2
                    size={15}
                    className="shrink-0"
                    style={{ color: "#48C970", filter: "drop-shadow(0 0 4px rgba(72,201,112,0.40))" }}
                  />
                ) : (
                  <AlertTriangle size={15} className="shrink-0" style={{ color: "#F59E0B" }} />
                )}
                <span
                  className="text-[12px]"
                  style={{
                    color: item.ok ? "rgba(212,240,227,0.65)" : "#F59E0B",
                    fontWeight: item.ok ? 400 : 500,
                  }}
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

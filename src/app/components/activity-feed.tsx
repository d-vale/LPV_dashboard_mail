import {
  CheckCircle2,
  AlertCircle,
  Brain,
  ArrowRight,
  Clock,
  RefreshCw,
  Shield,
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "classification",
    message: "Système a classifié 'Prescription CPAP - Patient 4521' comme Prescription médicale",
    detail: "Précision: 98.5% — Aiguillage vers Sous-boite Prescriptions",
    time: "Il y a 2 min",
    icon: Brain,
    color: "#A78BFA",
  },
  {
    id: 2,
    type: "validation",
    message: "J. Balsiger a validé le tri de 5 emails en attente",
    detail: "3 prescriptions, 1 rapport, 1 demande admin",
    time: "Il y a 8 min",
    icon: CheckCircle2,
    color: "#48C970",
  },
  {
    id: 3,
    type: "alert",
    message: "Email de Dr. Favre nécessite une vérification manuelle",
    detail: "Précision: 67.4% — Ambiguïté prescription / demande de thérapie",
    time: "Il y a 15 min",
    icon: AlertCircle,
    color: "#F59E0B",
  },
  {
    id: 4,
    type: "routing",
    message: "12 emails automatiquement aiguillés vers les sous-boites",
    detail: "Aucune erreur détectée sur le dernier batch",
    time: "Il y a 23 min",
    icon: ArrowRight,
    color: "#22D3EE",
  },
  {
    id: 5,
    type: "learning",
    message: "Algorithme mis à jour avec 15 nouvelles corrections",
    detail: "Précision estimée: +0.3% sur la catégorie Rapports",
    time: "Il y a 1h",
    icon: RefreshCw,
    color: "#A78BFA",
  },
  {
    id: 6,
    type: "security",
    message: "Vérification nLPD quotidienne complétée",
    detail: "Tous les critères sont conformes",
    time: "Il y a 2h",
    icon: Shield,
    color: "#48C970",
  },
];

export function ActivityFeed() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(0, 43, 41, 0.80)",
        border: "1px solid rgba(212, 240, 227, 0.08)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
          Activité récente
        </h3>
        <button
          className="text-[11px] transition-colors"
          style={{ fontWeight: 500, color: "#48C970" }}
        >
          Voir tout
        </button>
      </div>

      <div className="space-y-0">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: `${activity.color}12`,
                    border: `1px solid ${activity.color}20`,
                    boxShadow: `0 0 12px ${activity.color}15`,
                  }}
                >
                  <Icon size={14} style={{ color: activity.color }} />
                </div>
                {index < activities.length - 1 && (
                  <div
                    className="w-px flex-1 my-1"
                    style={{
                      background: `linear-gradient(to bottom, ${activity.color}30, rgba(212,240,227,0.04))`,
                      minHeight: 16,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 min-w-0 flex-1">
                <p className="text-[12px] mb-0.5" style={{ fontWeight: 500, color: "rgba(212,240,227,0.85)" }}>
                  {activity.message}
                </p>
                <p className="text-[11px] mb-1" style={{ color: "rgba(212,240,227,0.40)" }}>
                  {activity.detail}
                </p>
                <span
                  className="text-[10px] flex items-center gap-1"
                  style={{ color: "rgba(212,240,227,0.25)", fontFamily: "'JetBrains Mono', monospace" }}
                >
                  <Clock size={10} />
                  {activity.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

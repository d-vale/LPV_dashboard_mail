import {
  CheckCircle2,
  AlertCircle,
  Brain,
  ArrowRight,
  Clock,
  Mail,
  RefreshCw,
  Shield,
} from "lucide-react";

const activities = [
  {
    id: 1,
    type: "classification",
    message: "Système a classifié 'Prescription CPAP - Patient 4521' comme Prescription medicale",
    detail: "Précision: 98.5% - Aiguille vers Sous-boite Prescriptions",
    time: "Il y a 2 min",
    icon: Brain,
    color: "#8B5CF6",
  },
  {
    id: 2,
    type: "validation",
    message: "J. Balsiger a valide le tri de 5 emails en attente",
    detail: "3 prescriptions, 1 rapport, 1 demande admin",
    time: "Il y a 8 min",
    icon: CheckCircle2,
    color: "#10B981",
  },
  {
    id: 3,
    type: "alert",
    message: "Email de Dr. Favre necesssite une verification manuelle",
    detail: "Précision: 67.4% - Ambiguite entre prescription et demande de therapie",
    time: "Il y a 15 min",
    icon: AlertCircle,
    color: "#F59E0B",
  },
  {
    id: 4,
    type: "routing",
    message: "12 emails automatiquement aiguilles vers les sous-boites",
    detail: "Aucune erreur detectee sur le dernier batch",
    time: "Il y a 23 min",
    icon: ArrowRight,
    color: "#2563EB",
  },
  {
    id: 5,
    type: "learning",
    message: "Algorithme mis à jour avec 15 nouvelles corrections",
    detail: "Precision estimee: +0.3% sur la categorie Rapports",
    time: "Il y a 1h",
    icon: RefreshCw,
    color: "#8B5CF6",
  },
  {
    id: 6,
    type: "security",
    message: "Verification nLPD quotidienne completee",
    detail: "Tous les criteres sont conformes",
    time: "Il y a 2h",
    icon: Shield,
    color: "#10B981",
  },
];

export function ActivityFeed() {
  return (
    <div className="bg-white rounded-xl p-5 border border-black/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
          Activite recente
        </h3>
        <button className="text-[11px] text-[#449850] hover:text-[#367A40] transition-colors" style={{ fontWeight: 500 }}>
          Voir tout
        </button>
      </div>

      <div className="space-y-0">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex gap-3 group">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${activity.color}12` }}
                >
                  <Icon size={14} style={{ color: activity.color }} />
                </div>
                {index < activities.length - 1 && (
                  <div className="w-px h-full bg-[#F3F4F6] my-1" />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 min-w-0 flex-1">
                <p className="text-[12px] text-[#1B1B2F] mb-0.5" style={{ fontWeight: 500 }}>
                  {activity.message}
                </p>
                <p className="text-[11px] text-[#9CA3AF] mb-1">
                  {activity.detail}
                </p>
                <span className="text-[10px] text-[#D1D5DB] flex items-center gap-1">
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
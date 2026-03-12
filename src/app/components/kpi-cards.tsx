import {
  Mail,
  Brain,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

const kpis = [
  {
    title: "Emails traites aujourd'hui",
    value: "87",
    subtitle: "sur 100 recus",
    change: "+12%",
    trend: "up" as const,
    icon: Mail,
    color: "#2563EB",
    bgColor: "#EFF6FF",
  },
  {
    title: "Taux de classification",
    value: "94.2%",
    subtitle: "précision moyenne",
    change: "+2.1%",
    trend: "up" as const,
    icon: Brain,
    color: "#10B981",
    bgColor: "#ECFDF5",
  },
  {
    title: "Temps moyen de tri",
    value: "1.8s",
    subtitle: "vs 4min manuel",
    change: "-0.3s",
    trend: "up" as const,
    icon: Clock,
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
  },
  {
    title: "Emails en attente",
    value: "13",
    subtitle: "validation humaine requise",
    change: "+5",
    trend: "down" as const,
    icon: AlertTriangle,
    color: "#F59E0B",
    bgColor: "#FFFBEB",
  },
];

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className="bg-white rounded-xl p-5 border border-black/5 hover:shadow-lg transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
            {/* Background decoration */}
            <div
              className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-[0.04] group-hover:opacity-[0.08] transition-opacity"
              style={{ backgroundColor: kpi.color }}
            />

            <div className="flex items-start justify-between mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: kpi.bgColor }}
              >
                <Icon size={20} style={{ color: kpi.color }} />
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] ${
                  kpi.trend === "up"
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-amber-50 text-amber-600"
                }`}
                style={{ fontWeight: 600 }}
              >
                {kpi.trend === "up" ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {kpi.change}
              </div>
            </div>

            <p className="text-[28px] text-[#1B1B2F] mb-1" style={{ fontWeight: 700, lineHeight: 1.1 }}>
              {kpi.value}
            </p>
            <p className="text-[13px] text-[#1B1B2F]/80 mb-0.5" style={{ fontWeight: 500 }}>
              {kpi.title}
            </p>
            <p className="text-[11px] text-[#6B7280]">{kpi.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}

export function QuickStats() {
  return (
    <div className="bg-white rounded-xl p-5 border border-black/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>Performance du jour</h3>
        <span className="text-[11px] text-[#6B7280] bg-[#F3F4F6] px-2.5 py-1 rounded-full">
          Mis a jour il y a 2 min
        </span>
      </div>
      <div className="space-y-3">
        {[
          { label: "Prescriptions medicales", count: 32, total: 87, color: "#449850" },
          { label: "Rapports medicaux", count: 24, total: 87, color: "#2563EB" },
          { label: "Demandes administratives", count: 18, total: 87, color: "#10B981" },
          { label: "Factures", count: 8, total: 87, color: "#F59E0B" },
          { label: "Autres / Non classifie", count: 5, total: 87, color: "#6B7280" },
        ].map((stat) => (
          <div key={stat.label} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
                <span className="text-[12px] text-[#1B1B2F]/80" style={{ fontWeight: 500 }}>
                  {stat.label}
                </span>
              </div>
              <span className="text-[12px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
                {stat.count}
              </span>
            </div>
            <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(stat.count / stat.total) * 100}%`,
                  backgroundColor: stat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
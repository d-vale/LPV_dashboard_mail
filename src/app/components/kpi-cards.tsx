import { useState, useEffect } from "react";
import {
  Mail,
  Brain,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

/* ── Animated counter hook ─────────────────────────────── */
function useCounter(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const steps = 50;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

/* ── KPI data ──────────────────────────────────────────── */
const kpis = [
  {
    title: "Emails traités aujourd'hui",
    numericValue: 87,
    displaySuffix: "",
    subtitle: "sur 100 reçus",
    change: "+12%",
    trend: "up" as const,
    icon: Mail,
    glowColor: "rgba(34, 211, 238, 0.20)",
    borderGlow: "rgba(34, 211, 238, 0.15)",
    accentColor: "#22D3EE",
  },
  {
    title: "Taux de classification",
    numericValue: 942,
    displaySuffix: "%",
    displayDivide: 10,
    subtitle: "précision moyenne",
    change: "+2.1%",
    trend: "up" as const,
    icon: Brain,
    glowColor: "rgba(4, 135, 64, 0.20)",
    borderGlow: "rgba(4, 135, 64, 0.20)",
    accentColor: "#48C970",
  },
  {
    title: "Temps moyen de tri",
    numericValue: 18,
    displaySuffix: "s",
    displayDivide: 10,
    subtitle: "vs 4 min manuel",
    change: "-0.3s",
    trend: "up" as const,
    icon: Clock,
    glowColor: "rgba(167, 139, 250, 0.20)",
    borderGlow: "rgba(167, 139, 250, 0.15)",
    accentColor: "#A78BFA",
  },
  {
    title: "Emails en attente",
    numericValue: 13,
    displaySuffix: "",
    subtitle: "validation humaine requise",
    change: "+5",
    trend: "down" as const,
    icon: AlertTriangle,
    glowColor: "rgba(245, 158, 11, 0.20)",
    borderGlow: "rgba(245, 158, 11, 0.15)",
    accentColor: "#F59E0B",
  },
];

/* ── Single KPI card ─────────────────────────────────────── */
function KpiCard({ kpi, index }: { kpi: typeof kpis[0]; index: number }) {
  const Icon = kpi.icon;
  const counterVal = useCounter(kpi.numericValue, 1200 + index * 100);
  const displayVal = kpi.displayDivide
    ? (counterVal / kpi.displayDivide).toFixed(1) + kpi.displaySuffix
    : counterVal + kpi.displaySuffix;

  return (
    <div
      className="rounded-2xl p-5 cursor-pointer relative overflow-hidden transition-all duration-300 group"
      style={{
        background: "rgba(0, 43, 41, 0.80)",
        border: `1px solid ${kpi.borderGlow}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        animation: `slideInUp 0.5s ease ${index * 0.08}s both`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 30px ${kpi.glowColor}, 0 8px 32px rgba(0,0,0,0.3)`;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.borderColor = kpi.accentColor + "40";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.borderColor = kpi.borderGlow;
      }}
    >
      {/* Background glow orb */}
      <div
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full pointer-events-none transition-opacity duration-300"
        style={{ background: kpi.glowColor, filter: "blur(20px)", opacity: 0.6 }}
      />

      <div className="flex items-start justify-between mb-4 relative">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: `${kpi.accentColor}15`,
            border: `1px solid ${kpi.accentColor}20`,
          }}
        >
          <Icon size={20} style={{ color: kpi.accentColor }} />
        </div>
        <div
          className="flex items-center gap-1 px-2 py-1 rounded-full text-[11px]"
          style={{
            background: kpi.trend === "up"
              ? "rgba(4, 135, 64, 0.12)"
              : "rgba(245, 158, 11, 0.12)",
            color: kpi.trend === "up" ? "#48C970" : "#F59E0B",
            border: `1px solid ${kpi.trend === "up" ? "rgba(4,135,64,0.20)" : "rgba(245,158,11,0.20)"}`,
            fontWeight: 600,
          }}
        >
          {kpi.trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {kpi.change}
        </div>
      </div>

      <p
        className="mb-1 relative"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "2.6rem",
          lineHeight: 1,
          color: "#F0FFF8",
          letterSpacing: "0.02em",
          animation: "countUp 0.4s ease both",
        }}
      >
        {displayVal}
      </p>
      <p className="text-[13px] mb-0.5 relative" style={{ fontWeight: 500, color: "rgba(212,240,227,0.80)" }}>
        {kpi.title}
      </p>
      <p className="text-[11px] relative" style={{ color: "rgba(212,240,227,0.40)" }}>
        {kpi.subtitle}
      </p>
    </div>
  );
}

/* ── KpiCards grid ─────────────────────────────────────── */
export function KpiCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {kpis.map((kpi, i) => (
        <KpiCard key={kpi.title} kpi={kpi} index={i} />
      ))}
    </div>
  );
}

/* ── QuickStats ────────────────────────────────────────── */
export function QuickStats() {
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
        <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>Performance du jour</h3>
        <span
          className="text-[11px] px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(0, 56, 51, 0.60)",
            color: "rgba(212,240,227,0.50)",
            border: "1px solid rgba(212,240,227,0.06)",
          }}
        >
          Mis à jour il y a 2 min
        </span>
      </div>
      <div className="space-y-3">
        {[
          { label: "Prescriptions médicales", count: 32, total: 87, color: "#48C970" },
          { label: "Rapports médicaux", count: 24, total: 87, color: "#22D3EE" },
          { label: "Demandes administratives", count: 18, total: 87, color: "#34D399" },
          { label: "Factures", count: 8, total: 87, color: "#F59E0B" },
          { label: "Autres / Non classifié", count: 5, total: 87, color: "rgba(212,240,227,0.30)" },
        ].map((stat) => (
          <div key={stat.label} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stat.color }} />
                <span className="text-[12px]" style={{ fontWeight: 500, color: "rgba(212,240,227,0.70)" }}>
                  {stat.label}
                </span>
              </div>
              <span className="text-[12px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
                {stat.count}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(212,240,227,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(stat.count / stat.total) * 100}%`,
                  background: `linear-gradient(90deg, ${stat.color}, ${stat.color}99)`,
                  boxShadow: `0 0 6px ${stat.color}60`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

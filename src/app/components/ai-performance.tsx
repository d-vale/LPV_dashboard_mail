import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Brain, TrendingUp, Zap, Target, RefreshCw } from "lucide-react";

const learningData = [
  { semaine: "S1", precision: 78.5 },
  { semaine: "S2", precision: 82.3 },
  { semaine: "S3", precision: 85.1 },
  { semaine: "S4", precision: 88.7 },
  { semaine: "S5", precision: 91.4 },
  { semaine: "S6", precision: 92.8 },
  { semaine: "S7", precision: 93.5 },
  { semaine: "S8", precision: 94.2 },
];

const glassStyle = {
  background: "rgba(0, 43, 41, 0.80)",
  border: "1px solid rgba(212, 240, 227, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-3 py-2 rounded-xl text-[12px]"
        style={{
          background: "rgba(0, 20, 19, 0.95)",
          border: "1px solid rgba(212, 240, 227, 0.12)",
          color: "#F0FFF8",
        }}
      >
        <p style={{ fontWeight: 600 }}>{label}</p>
        <p style={{ color: "#48C970" }}>Précision: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function AiPerformance() {
  return (
    <div className="rounded-2xl p-5" style={glassStyle}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(167,139,250,0.25), rgba(109,40,217,0.15))",
              border: "1px solid rgba(167,139,250,0.20)",
              boxShadow: "0 0 20px rgba(167,139,250,0.10)",
            }}
          >
            <Brain size={18} style={{ color: "#A78BFA" }} />
          </div>
          <div>
            <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
              Performance du système
            </h3>
            <p className="text-[12px]" style={{ color: "rgba(212,240,227,0.45)" }}>
              Apprentissage continu
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: "rgba(0, 56, 51, 0.50)",
            border: "1px solid rgba(212,240,227,0.08)",
            color: "rgba(212,240,227,0.50)",
            fontWeight: 500,
          }}
        >
          <RefreshCw size={12} />
          Actualiser
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: "Précision globale", value: "94.2%", icon: Target, color: "#48C970" },
          { label: "Temps de réponse", value: "1.8s", icon: Zap, color: "#F59E0B" },
          { label: "Emails auto-classés", value: "82%", icon: Brain, color: "#22D3EE" },
          { label: "Amélioration / sem.", value: "+0.7%", icon: TrendingUp, color: "#A78BFA" },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="rounded-xl p-3.5 flex items-center gap-3 transition-all"
              style={{
                background: "rgba(0, 56, 51, 0.40)",
                border: "1px solid rgba(212,240,227,0.06)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${metric.color}12`, border: `1px solid ${metric.color}20` }}
              >
                <Icon size={16} style={{ color: metric.color }} />
              </div>
              <div>
                <p
                  className="text-[16px]"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    color: "#F0FFF8",
                    letterSpacing: "0.02em",
                    lineHeight: 1.1,
                  }}
                >
                  {metric.value}
                </p>
                <p className="text-[10px]" style={{ color: "rgba(212,240,227,0.40)" }}>{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Learning Curve */}
      <div>
        <p className="text-[12px] mb-3" style={{ fontWeight: 500, color: "rgba(212,240,227,0.50)" }}>
          Courbe d'apprentissage (8 dernières semaines)
        </p>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={learningData}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,240,227,0.04)" />
              <XAxis
                dataKey="semaine"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "rgba(212,240,227,0.35)" }}
              />
              <YAxis
                domain={[70, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "rgba(212,240,227,0.35)" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="precision"
                stroke="#A78BFA"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#A78BFA", strokeWidth: 2, stroke: "#001A19" }}
                activeDot={{ r: 6, fill: "#A78BFA", strokeWidth: 0 }}
                filter="url(#glow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

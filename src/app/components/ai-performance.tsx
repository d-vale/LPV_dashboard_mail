import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Brain, TrendingUp, Zap, Target, RefreshCw } from "lucide-react";

const accuracyData = [
  { name: "Precision", value: 94.2, fill: "#10B981" },
];

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1B1B2F] text-white px-3 py-2 rounded-lg shadow-xl text-[12px]">
        <p style={{ fontWeight: 600 }}>{label}</p>
        <p className="text-white/70">Precision: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export function AiPerformance() {
  return (
    <div className="bg-white rounded-xl p-5 border border-black/5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-[15px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
              Performance du système
            </h3>
            <p className="text-[12px] text-[#6B7280]">
              Apprentissage continu
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-[11px] text-[#6B7280] hover:text-[#1B1B2F] bg-[#F7F8FA] px-3 py-1.5 rounded-lg transition-colors" style={{ fontWeight: 500 }}>
          <RefreshCw size={12} />
          Actualiser
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: "Precision globale", value: "94.2%", icon: Target, color: "#10B981" },
          { label: "Temps de reponse", value: "1.8s", icon: Zap, color: "#F59E0B" },
          { label: "Emails auto-classes", value: "82%", icon: Brain, color: "#2563EB" },
          { label: "Amelioration / sem.", value: "+0.7%", icon: TrendingUp, color: "#8B5CF6" },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.label}
              className="bg-[#F7F8FA] rounded-xl p-3.5 flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${metric.color}15` }}
              >
                <Icon size={16} style={{ color: metric.color }} />
              </div>
              <div>
                <p className="text-[16px] text-[#1B1B2F]" style={{ fontWeight: 700 }}>
                  {metric.value}
                </p>
                <p className="text-[10px] text-[#9CA3AF]">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Learning Curve */}
      <div>
        <p className="text-[12px] text-[#6B7280] mb-3" style={{ fontWeight: 500 }}>
          Courbe d'apprentissage (8 dernieres semaines)
        </p>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={learningData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="semaine"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
              />
              <YAxis
                domain={[70, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#9CA3AF" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="precision"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 6, fill: "#8B5CF6", strokeWidth: 3, stroke: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
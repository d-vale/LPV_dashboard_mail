import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const categories = [
  { name: "Prescriptions médicales", value: 32, color: "#48C970", icon: "Rx" },
  { name: "Rapports médicaux", value: 24, color: "#22D3EE", icon: "RM" },
  { name: "Demandes administratives", value: 18, color: "#34D399", icon: "DA" },
  { name: "Factures", value: 8, color: "#F59E0B", icon: "FA" },
  { name: "Demandes de thérapie", value: 5, color: "#A78BFA", icon: "DT" },
];

const total = categories.reduce((s, c) => s + c.value, 0);

const glassStyle = {
  background: "rgba(0, 43, 41, 0.80)",
  border: "1px solid rgba(212, 240, 227, 0.08)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        className="px-3 py-2 rounded-xl text-[12px]"
        style={{
          background: "rgba(0, 20, 19, 0.95)",
          border: "1px solid rgba(212, 240, 227, 0.12)",
          backdropFilter: "blur(12px)",
          color: "#F0FFF8",
        }}
      >
        <p style={{ fontWeight: 600 }}>{data.name}</p>
        <p style={{ color: "rgba(212,240,227,0.60)" }}>
          {data.value} emails ({((data.value / total) * 100).toFixed(1)}%)
        </p>
      </div>
    );
  }
  return null;
};

export function ClassificationChart() {
  return (
    <div className="rounded-2xl p-5" style={glassStyle}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
            Classification par catégorie
          </h3>
          <p className="text-[12px] mt-0.5" style={{ color: "rgba(212,240,227,0.45)" }}>
            Répartition des {total} emails traités
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-[180px] h-[180px] relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={82}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {categories.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    style={{ filter: `drop-shadow(0 0 6px ${entry.color}60)` }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2rem",
                color: "#F0FFF8",
                lineHeight: 1,
              }}
            >
              {total}
            </span>
            <span className="text-[10px]" style={{ color: "rgba(212,240,227,0.40)" }}>emails</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] text-white shrink-0"
                  style={{
                    background: `${cat.color}20`,
                    border: `1px solid ${cat.color}30`,
                    color: cat.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                  }}
                >
                  {cat.icon}
                </div>
                <div>
                  <p className="text-[12px]" style={{ fontWeight: 500, color: "rgba(212,240,227,0.80)" }}>
                    {cat.name}
                  </p>
                  <p className="text-[10px]" style={{ color: "rgba(212,240,227,0.35)" }}>
                    {((cat.value / total) * 100).toFixed(1)}% du total
                  </p>
                </div>
              </div>
              <span
                className="text-[14px] shrink-0"
                style={{ fontFamily: "'Bebas Neue', sans-serif", color: cat.color, letterSpacing: "0.02em" }}
              >
                {cat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

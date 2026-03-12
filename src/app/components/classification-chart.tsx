import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const categories = [
  { name: "Prescriptions medicales", value: 32, color: "#449850", icon: "Rx" },
  { name: "Rapports medicaux", value: 24, color: "#2563EB", icon: "RM" },
  { name: "Demandes administratives", value: 18, color: "#10B981", icon: "DA" },
  { name: "Factures", value: 8, color: "#F59E0B", icon: "FA" },
  { name: "Demandes de therapie", value: 5, color: "#8B5CF6", icon: "DT" },
];

const total = categories.reduce((s, c) => s + c.value, 0);

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1B1B2F] text-white px-3 py-2 rounded-lg shadow-xl text-[12px]">
        <p style={{ fontWeight: 600 }}>{data.name}</p>
        <p className="text-white/70">{data.value} emails ({((data.value / total) * 100).toFixed(1)}%)</p>
      </div>
    );
  }
  return null;
};

export function ClassificationChart() {
  return (
    <div className="bg-white rounded-xl p-5 border border-black/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-[15px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
            Classification par categorie
          </h3>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            Repartition des {total} emails traites
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-[180px] h-[180px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {categories.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-[22px] text-[#1B1B2F]" style={{ fontWeight: 700 }}>{total}</span>
            <span className="text-[10px] text-[#6B7280]">emails</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {categories.map((cat) => (
            <div key={cat.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] text-white"
                  style={{ backgroundColor: cat.color, fontWeight: 700 }}
                >
                  {cat.icon}
                </div>
                <div>
                  <p className="text-[12px] text-[#1B1B2F]" style={{ fontWeight: 500 }}>
                    {cat.name}
                  </p>
                  <p className="text-[10px] text-[#9CA3AF]">
                    {((cat.value / total) * 100).toFixed(1)}% du total
                  </p>
                </div>
              </div>
              <span className="text-[14px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
                {cat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
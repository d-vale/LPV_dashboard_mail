import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const weeklyData = [
  { jour: "Lun", recus: 98, traites: 95, erreurs: 3 },
  { jour: "Mar", recus: 112, traites: 108, erreurs: 4 },
  { jour: "Mer", recus: 87, traites: 85, erreurs: 2 },
  { jour: "Jeu", recus: 105, traites: 102, erreurs: 3 },
  { jour: "Ven", recus: 93, traites: 90, erreurs: 3 },
  { jour: "Sam", recus: 34, traites: 34, erreurs: 0 },
  { jour: "Dim", recus: 12, traites: 12, erreurs: 0 },
];

const hourlyData = [
  { heure: "06h", emails: 3 },
  { heure: "07h", emails: 8 },
  { heure: "08h", emails: 22 },
  { heure: "09h", emails: 18 },
  { heure: "10h", emails: 15 },
  { heure: "11h", emails: 12 },
  { heure: "12h", emails: 5 },
  { heure: "13h", emails: 8 },
  { heure: "14h", emails: 14 },
  { heure: "15h", emails: 11 },
  { heure: "16h", emails: 9 },
  { heure: "17h", emails: 6 },
  { heure: "18h", emails: 2 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1B1B2F] text-white px-3 py-2 rounded-lg shadow-xl text-[12px]">
        <p style={{ fontWeight: 600 }} className="mb-1">{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} className="text-white/80">
            <span
              className="inline-block w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: item.color }}
            />
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function EmailVolumeChart() {
  return (
    <div className="bg-white rounded-xl p-5 border border-black/5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
            Volume d'emails - Semaine
          </h3>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            Semaine du 3 au 9 mars 2026
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full bg-[#449850]" />
            <span className="text-[#6B7280]">Recus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full bg-[#10B981]" />
            <span className="text-[#6B7280]">Traites</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full bg-[#DC2626]" />
            <span className="text-[#6B7280]">Erreurs</span>
          </div>
        </div>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="jour"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="recus"
              name="Recus"
              stroke="#449850"
              strokeWidth={2}
              fill="rgba(68,152,80,0.12)"
            />
            <Area
              type="monotone"
              dataKey="traites"
              name="Traites"
              stroke="#10B981"
              strokeWidth={2}
              fill="rgba(16,185,129,0.12)"
            />
            <Area
              type="monotone"
              dataKey="erreurs"
              name="Erreurs"
              stroke="#DC2626"
              strokeWidth={2}
              fill="rgba(220,38,38,0.08)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function HourlyDistribution() {
  return (
    <div className="bg-white rounded-xl p-5 border border-black/5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] text-[#1B1B2F]" style={{ fontWeight: 600 }}>
            Distribution horaire
          </h3>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            Aujourd'hui, 11 mars 2026
          </p>
        </div>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="heure"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#9CA3AF" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="emails"
              name="Emails"
              fill="#449850"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
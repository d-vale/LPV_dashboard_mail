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
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          color: "#F0FFF8",
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((item: any, index: number) => (
          <p key={index} style={{ color: "rgba(212,240,227,0.70)", marginBottom: 2 }}>
            <span
              className="inline-block w-2 h-2 rounded-full mr-1.5"
              style={{ backgroundColor: item.color }}
            />
            {item.name}: <span style={{ color: "#F0FFF8", fontWeight: 600 }}>{item.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function EmailVolumeChart() {
  return (
    <div className="rounded-2xl p-5" style={glassStyle}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
            Volume d'emails — Semaine
          </h3>
          <p className="text-[12px] mt-0.5" style={{ color: "rgba(212,240,227,0.45)" }}>
            Semaine du 3 au 9 mars 2026
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          {[
            { color: "#48C970", label: "Reçus" },
            { color: "#22D3EE", label: "Traités" },
            { color: "#E30613", label: "Erreurs" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-3 h-1.5 rounded-full" style={{ backgroundColor: l.color, boxShadow: `0 0 6px ${l.color}80` }} />
              <span style={{ color: "rgba(212,240,227,0.50)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData}>
            <defs>
              <linearGradient id="fillRecus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#48C970" stopOpacity={0.20} />
                <stop offset="100%" stopColor="#48C970" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillTraites" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillErreurs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E30613" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#E30613" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,240,227,0.04)" />
            <XAxis
              dataKey="jour"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "rgba(212,240,227,0.35)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "rgba(212,240,227,0.35)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="recus" name="Reçus" stroke="#48C970" strokeWidth={2} fill="url(#fillRecus)" />
            <Area type="monotone" dataKey="traites" name="Traités" stroke="#22D3EE" strokeWidth={2} fill="url(#fillTraites)" />
            <Area type="monotone" dataKey="erreurs" name="Erreurs" stroke="#E30613" strokeWidth={2} fill="url(#fillErreurs)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function HourlyDistribution() {
  return (
    <div className="rounded-2xl p-5" style={glassStyle}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px]" style={{ fontWeight: 600, color: "#F0FFF8" }}>
            Distribution horaire
          </h3>
          <p className="text-[12px] mt-0.5" style={{ color: "rgba(212,240,227,0.45)" }}>
            Aujourd'hui, 12 mars 2026
          </p>
        </div>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={hourlyData}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#48C970" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#048740" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,240,227,0.04)" vertical={false} />
            <XAxis
              dataKey="heure"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "rgba(212,240,227,0.35)" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "rgba(212,240,227,0.35)" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="emails" name="Emails" fill="url(#barGrad)" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

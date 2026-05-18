import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AnalyticsChart({ data = [], type = "area", dataKey = "value", title = "Analytics" }) {
  const fallback = [
    { name: "Mon", value: 12000 },
    { name: "Tue", value: 18000 },
    { name: "Wed", value: 16000 },
    { name: "Thu", value: 24000 },
    { name: "Fri", value: 32000 },
  ];
  const chartData = data.length ? data : fallback;
  return (
    <div className="rounded-[1.75rem] border border-bark/10 bg-white p-5 shadow-card">
      <h3 className="mb-4 text-lg font-bold text-ink">{title}</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eadccb" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#49705b" radius={[12, 12, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="paw-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#49705b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#49705b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eadccb" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey={dataKey} stroke="#49705b" fill="url(#paw-area)" strokeWidth={3} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { mes: "Ene", presupuesto: 15000 },
  { mes: "Feb", presupuesto: 14200 },
  { mes: "Mar", presupuesto: 13800 },
  { mes: "Abr", presupuesto: 12450 },
  { mes: "May", presupuesto: 11900 },
  { mes: "Jun", presupuesto: 11200 },
  { mes: "Jul", presupuesto: 10800 },
  { mes: "Ago", presupuesto: 10500 },
  { mes: "Sep", presupuesto: 9800 },
  { mes: "Oct", presupuesto: 9200 },
  { mes: "Nov", presupuesto: 8700 },
  { mes: "Dic", presupuesto: 8000 },
];

const BudgetEvolution = () => {
  return (
    <div className="rounded-xl bg-card p-6 border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4">Evolución del presupuesto disponible</h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" vertical={false} />
            <XAxis
              dataKey="mes"
              tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toLocaleString("es-ES")} €`, "Presupuesto"]}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                fontSize: "12px",
                background: "hsl(0, 0%, 100%)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />
            <Line
              type="monotone"
              dataKey="presupuesto"
              stroke="hsl(168, 62%, 55%)"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "hsl(168, 62%, 55%)", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "hsl(168, 62%, 55%)", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetEvolution;

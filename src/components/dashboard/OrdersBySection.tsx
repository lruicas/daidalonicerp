import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { section: "E-Software", pedidos: 12 },
  { section: "E-Hardware", pedidos: 8 },
  { section: "Diseño", pedidos: 15 },
  { section: "RRPP-Mkt", pedidos: 6 },
  { section: "RRPP-Corp", pedidos: 4 },
];

const colors = [
  "hsl(168, 62%, 55%)",
  "hsl(30, 95%, 62%)",
  "hsl(340, 82%, 65%)",
  "hsl(168, 45%, 42%)",
  "hsl(30, 80%, 50%)",
];

const OrdersBySection = () => {
  return (
    <div className="rounded-xl bg-card p-6 border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4">Pedidos agrupados por sección</h3>
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="20%" margin={{ bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" vertical={false} />
            <XAxis
              dataKey="section"
              tick={{ fontSize: 10, fill: "hsl(0, 0%, 45%)" }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(0, 0%, 45%)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                fontSize: "12px",
                background: "hsl(0, 0%, 100%)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />
            <Bar dataKey="pedidos" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={colors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersBySection;

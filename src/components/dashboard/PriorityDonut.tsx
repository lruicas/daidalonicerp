import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { mockBudgets } from "@/lib/budget-data";
import type { Priority } from "@/lib/budget-data";

const PRIORITY_COLORS: Record<Priority, string> = {
  Alta: "hsl(340, 82%, 65%)",
  Media: "hsl(30, 95%, 62%)",
  Baja: "hsl(168, 62%, 55%)",
};

const PriorityDonut = () => {
  const counts: Record<Priority, number> = { Alta: 0, Media: 0, Baja: 0 };
  mockBudgets.forEach((b) => {
    counts[b.prioridad]++;
  });

  const data = (["Alta", "Media", "Baja"] as Priority[]).map((p) => ({
    name: p,
    value: counts[p],
    color: PRIORITY_COLORS[p],
  }));

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="w-[100px] h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={45}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                fontSize: "12px",
                background: "hsl(0, 0%, 100%)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-1.5">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-foreground">
              {item.name}: <span className="font-semibold">{item.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityDonut;

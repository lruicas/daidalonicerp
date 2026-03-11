import { CalendarDays } from "lucide-react";

const events = [
  { date: "15 Mar", title: "Feria Tecnológica", type: "Ingreso" },
  { date: "22 Mar", title: "Taller de impresión 3D", type: "Gasto" },
  { date: "02 Abr", title: "Hackathon UPV", type: "Ingreso" },
  { date: "10 Abr", title: "Compra materiales PCB", type: "Gasto" },
];

const typeColor: Record<string, string> = {
  Ingreso: "bg-primary text-primary-foreground",
  Gasto: "bg-accent text-accent-foreground",
};

const UpcomingEvents = () => {
  return (
    <div className="rounded-xl bg-card p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        <h3 className="text-sm font-semibold text-foreground">Próximos eventos económicos</h3>
      </div>
      <div className="space-y-3">
        {events.map((ev, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground w-14 shrink-0">{ev.date}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{ev.title}</p>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeColor[ev.type]}`}>
              {ev.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
